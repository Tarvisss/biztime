const express = require("express");
const router = express.Router();
const db = require("../db");


router.get('/', async(req, res, next) =>{
    try{
    const results = await db.query('SELECT * FROM invoices');
    return res.json(results.rows);
       } catch (error){
         return next(error);
       } 
})


router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            'SELECT * FROM invoices WHERE id = $1', [id]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "invoice not found" });
        }

        return res.json(results.rows[0]);
    } catch (error) {
        return next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
         // Extract comp_code and amt from request body
        const { comp_code, amt } = req.body;
        const results = await db.query(
            'INSERT INTO invoices ( comp_code, amt) VALUES ($1,$2) RETURNING *', [comp_code, amt] );
        return res.status(201).json(results.rows[0]);
    } catch (error) {
        return next(error)
    }
});

// I would like to go over this more /////////
router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the id from the URL parameter
      const { amt, paid } = req.body; // Extract amt from the request body
      const results = await db.query(
        `UPDATE invoices 
         SET 
           amt = $1,
           paid_date = CASE 
                        WHEN $3 = true THEN CURRENT_DATE
                        WHEN $3 = false THEN NULL
                        ELSE paid_date
                      END
         WHERE id = $2
         RETURNING *`, 
        [amt, id, paid]
      );

      if (results.rows.length === 0) {
        throw new ExpressError(`invoice not found`, 404)
      }

       return res.send({ invoices: results.rows[0] })
    } catch (error) {
      return next(error)
    }
  }); 

  router.delete('/:id', async (req, res, next) => {
    try{
        const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id])
        return res.send({message: "Deleted"})
    } catch (error) {
      return next(error)  
    }
  });

module.exports = router;