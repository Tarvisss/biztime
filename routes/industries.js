const express = require("express");
const router = express.Router();
const slugify = require('slugify');
const db = require("../db");


router.get('/', async(req, res, next) =>{
    try{
    const results = await db.query('SELECT * FROM industries');
    return res.json(results.rows);
       } catch (error){
         return next(error);
       } 
});


router.get('/:in_code', async (req, res, next) => {
    try {
        const { in_code } = req.params;
        const industResults = await db.query('SELECT * FROM industries WHERE in_code = $1', [in_code]);

        const companyResults = await db.query(
            `SELECT c.code, c.name
            FROM companies c 
            LEFT JOIN companies_industries ci ON c.code = ci.company_code 
            WHERE ci.industry_code =$1`,[in_code]);

        if (industResults.rows.length === 0) {
            return res.status(404).json({ message: "Industry not found" });
        }

        const industry = industResults.rows[0];
        industry.Companies = companyResults.rows;
        return res.json(industry);

    } catch (error) {
        return next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { in_code, name, description } = req.body;
        const results = await db.query(
            `INSERT INTO industries
            (in_code, name, description) 
            VALUES ($1,$2,$3) RETURNING *`, [in_code, name, description] );

        return res.status(201).json(results.rows[0]);
    } catch (error) {
        return next(error)
    }
});

router.put('/:in_code', async (req, res, next) => {
    try {
      const { in_code } = req.params;
      const { name, newCode } = req.body;
      const results = await db.query('UPDATE industries SET name=$1, in_code=$2 WHERE in_code=$3 RETURNING name, in_code', [name, newCode, in_code])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update company with code of ${in_code}`, 404)
      }
      return res.send({ industries: results.rows[0] })
    } catch (error) {
      return next(error)
    }
  });

  router.delete('/:in_code', async (req, res, next) => {
    try{
        const results = db.query('DELETE FROM industries WHERE in_code = $1', [req.params.in_code])
        return res.send({message: "Deleted"})
    } catch (error) {
      return next(error)  
    }
  });







module.exports = router;