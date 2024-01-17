const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Oracle DB Connection Config
const dbConfig = {
    user: "system",
    password: "manager",
    connectString: "localhost:/orcl",
  };

// Sample routes

app.get('/', async (req, res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute('SELECT * FROM employee');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Similar routes for update and delete operations
app.post('/pf_insert', async (req, res) => {
    const { wef_date, pf_per, epf_per, fpf_per, catg } = req.body;
  
    console.log('Received Data:', { wef_date, pf_per, epf_per, fpf_per, catg });
  
    try {
      const connection = await oracledb.getConnection(dbConfig);
      await connection.execute(`INSERT INTO pf VALUES (TO_DATE('${wef_date}', 'YYYY-MM-DD'),'${pf_per}','${epf_per}','${fpf_per}','${catg}')`);
      await connection.commit();
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.post('/employee_insert', async (req, res) => {
    const {emp_code,emp_name, emp_qual, emp_join_date,emp_resign_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,emp_bank_name,emp_bank_account_no } = req.body;
  
    console.log('Received Data:', { emp_code,emp_name, emp_qual, emp_join_date,emp_resign_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,emp_bank_name,emp_bank_account_no });
  
    try {
      const connection = await oracledb.getConnection(dbConfig);
      await connection.execute(`INSERT INTO emptable VALUES ('${emp_code}','${emp_name}','${emp_qual}',TO_DATE('${emp_join_date}', 'YYYY-MM-DD'),TO_DATE('${emp_resign_date}', 'YYYY-MM-DD'),'${emp_pan_no}',${emp_aadhar_no},'${emp_pf_flag}','${emp_pf_no}',${emp_esi_no},'${emp_est_flag}','${emp_gst_no}',${emp_basic},'${emp_dept}','${emp_hno}','${emp_street}','${emp_city}',${emp_pincode},'${emp_state}',${emp_ph_no},'${emp_email_id}','${emp_cons_res_flag}',${emp_spl_pay},'${emp_bank_ifsc}','${emp_bank_name}','${emp_bank_account_no}')`);
      await connection.commit();
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });  

  app.post('/da_insert', async (req, res) => {
    const { wef_date,catg,da_per} = req.body;
  
    console.log('Received Data:', {wef_date, catg,da_per });
  
    try {
      const connection = await oracledb.getConnection(dbConfig);
      await connection.execute(`INSERT INTO da_table VALUES (TO_DATE('${wef_date}', 'YYYY-MM-DD'), '${catg}','${da_per}')`);
      await connection.commit();
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/hra_insert', async (req, res) => {
    const { wef_date,catg,hra_per} = req.body;
    console.log('Received Data:',{ wef_date, catg,hra_per });
    try {
      const connection = await oracledb.getConnection(dbConfig);
      await connection.execute(`INSERT INTO hratable VALUES ('${catg}',TO_DATE('${wef_date}', 'YYYY-MM-DD'), ${hra_per})`);
      await connection.commit();
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.post('/trial',async(req,res)=>
{

});

 
  
app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});



// {
//   "emp_code":"1234",
// "emp_name": "janaki",
// "emp_qual": "B.Tech",
// "emp_join_date": "07-APR-23",
// "emp_resign_date":"07-APR-23",
// "emp_pan_no": "1234567899",
// "emp_aadhar_no": 1234567891,
// "emp_pf_flag": "n",
// "emp_pf_no": "1234567899",
// "emp_esi_no": 1234567899,
// "emp_est_flag": "n",
// "emp_gst_no": "1234567899",
// "emp_basic": 12345,
// "emp_dept": "cse",
// "emp_hno": "12.67-8",
// "emp_street": "Narasaraopet",
// "emp_city": "ap",
// "emp_pincode": 522601,
// "emp_state": "narasaraopeta",
// "emp_ph_no": 9494021841,
// "emp_email_id": "chinnam.janaki@gmail.com",
// "emp_cons_res_flag": "y",
// "emp_spl_pay": 345,
// "emp_bank_ifsc": "1234567899",
// "emp_bank_name": "bank",
// "emp_bank_account_no": "134"
// }