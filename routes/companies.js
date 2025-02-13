const express = require("express");
const router = express.Router();
const db = require("../db");


router.get('/', async(req, res, next) =>{
    try{
    const results = await db.query('SELECT * FROM companies');
    return res.json(results.rows);
       } catch (error){
         return next(error);
       } 
})


router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.json(results.rows[0]);
    } catch (error) {
        return next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING *', [code, name, description] );
        return res.status(201).json(results.rows[0]);
    } catch (error) {
        return next(error)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const { name, newCode } = req.body;
      const results = await db.query('UPDATE companies SET name=$1, code=$2 WHERE code=$3 RETURNING name, code', [name, newCode, code])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update company with code of ${code}`, 404)
      }
      return res.send({ companies: results.rows[0] })
    } catch (error) {
      return next(error)
    }
  })
  router.delete('/:code', async (req, res, next) => {
    try{
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        return res.send({message: "Deleted"})
    } catch (error) {
      return next(error)  
    }
  })





module.exports = router;