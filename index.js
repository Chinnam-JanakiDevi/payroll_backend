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
  const { emp_code, emp_name, emp_qual, emp_join_date, emp_resignation_date, emp_pan_no, emp_aadhar_no, emp_pf_flag, emp_pf_no, emp_esi_no, emp_est_flag, emp_gst_no, emp_basic, emp_dept, emp_hno, emp_street, emp_city, emp_pincode, emp_state, emp_ph_no, emp_email_id, emp_cons_res_flag, emp_spl_pay, emp_bank_ifsc, emp_bank_name, emp_bank_account_no } = req.body;

  console.log('Received Data:', { emp_code, emp_name, emp_qual, emp_join_date, emp_resignation_date, emp_pan_no, emp_aadhar_no, emp_pf_flag, emp_pf_no, emp_esi_no, emp_est_flag, emp_gst_no, emp_basic, emp_dept, emp_hno, emp_street, emp_city, emp_pincode, emp_state, emp_ph_no, emp_email_id, emp_cons_res_flag, emp_spl_pay, emp_bank_ifsc, emp_bank_name, emp_bank_account_no });

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`INSERT INTO emp VALUES ('${emp_code}','${emp_name}','${emp_qual}',TO_DATE('${emp_join_date}', 'YYYY-MM-DD'),TO_DATE('${emp_resignation_date}', 'YYYY-MM-DD'),'${emp_pan_no}',${emp_aadhar_no},'${emp_pf_flag}','${emp_pf_no}',${emp_esi_no},'${emp_est_flag}','${emp_gst_no}',${emp_basic},'${emp_dept}','${emp_hno}','${emp_street}','${emp_city}',${emp_pincode},'${emp_state}',${emp_ph_no},'${emp_email_id}','${emp_cons_res_flag}',${emp_spl_pay},'${emp_bank_ifsc}','${emp_bank_name}','${emp_bank_account_no}')`);
    await connection.commit();
    console.log('Data inserted successfully');
    res.send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/da_insert', async (req, res) => {
  const { wef_date, catg, da_per } = req.body;
  console.log('Received Data:', { wef_date, catg, da_per });

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
  const { wef_date, catg, hra_per } = req.body;
  console.log('Received Data:', { wef_date, catg, hra_per });
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

async function run() {
  let connection;
  try {
    // Establish a connection to the database
    const connection = await oracledb.getConnection(dbConfig);

    // Execute a PL/SQL block
    const result = await connection.execute(
      `declare
      s_code emptable.emp_code%type;
      s_basic emptable.emp_basic%type;
      s_month control1.c_month%type;
      s_year control1.c_year%type;
      s_cons emptable.emp_cons_res_flag%type;
      s_stop salary.e_sal_emp_stop%type;
      s_add_pay salary.e_sal_addl_pay%type;
      s_da salary.e_sal_da%type;
      s_hra salary.e_sal_hra%type;
      s_gross salary.e_sal_gross%type;
      s_lic salary.e_sal_lic_ded%type;
      s_advance salary.e_sal_advance_ded%type;
      s_transport salary.e_sal_transport_ded%type;
      s_esi salary.e_sal_esi_ded%type;
      s_epf salary.e_sal_epf_ded%type;
      s_fpf salary.e_sal_fpf_ded%type;
      s_pf salary.e_sal_pf_tax%type;
      s_other salary.e_sal_other_ded%type;
      s_gross_ded salary.e_sal_gross_ded%type;
      s_net salary.e_sal_net_pay%type;
      gross_ded float;
      pf float;
      
  
      cursor employee is
          select emptable.emp_code,emptable.emp_basic,emptable.emp_cons_res_flag
          from emptable where emptable.emp_resign_date is null;
  
  begin
      select c_month, c_year
      into s_month, s_year
      from control1;
      
  
   dbms_output.put_line(s_month||' : '||s_year);
   open employee;
      loop
            fetch employee into s_code,s_basic,s_cons;
             exit when employee%notfound;
             dbms_output.put_line(s_code);
             if s_cons='R' or s_cons='r' then
             s_stop :='Y';
             s_add_pay := s_basic+1000.00;
             s_da := (s_basic*10)/100;
             pf := s_basic + s_da;
             s_hra := (s_basic*11)/100;
             s_gross := s_add_pay + s_da + s_hra;
             s_lic := 100.00;
             s_advance := 1500.00;
             s_transport := 3000.00;
             s_esi := (0.75/s_gross)*100;
             s_pf := (pf * 12)/100;
             s_epf := (pf * 10)/100;
             s_fpf := s_pf-s_epf;
             s_other :=0.0;
             s_gross_ded := s_lic+s_advance+s_transport+s_pf+s_epf+s_fpf+s_other+s_esi;
             s_net := s_gross - s_gross_ded;
             
              insert into salary(e_sal_month,e_sal_year,e_sal_emp_code,e_sal_emp_basic,e_sal_emp_stop,e_sal_addl_pay,e_sal_da,e_sal_hra,e_sal_gross,e_sal_lic_ded,e_sal_advance_ded,e_sal_transport_ded,e_sal_esi_ded,e_sal_epf_ded,e_sal_fpf_ded,e_sal_pf_tax,e_sal_other_ded,e_sal_gross_ded,e_sal_net_pay)
                          values(s_month,s_year,s_code,s_basic,s_stop,s_add_pay,s_da,s_hra,s_gross,s_lic,s_advance,s_transport,s_esi,s_epf,s_fpf,s_pf,s_other,s_gross_ded,s_net);
             end if;
  
      end loop;
  close employee;
          
  end;`
    );

    // Process the result
    console.log('PL/SQL Execution Result:', result);
  } catch (err) {
    console.error('Error executing PL/SQL:', err);
  } finally {
    if (connection) {
      try {
        // Release the connection back to the pool
        await connection.close();
      } catch (err) {
        console.error('Error closing the connection:', err);
      }
    }
  }
}

// Run the function
// run();
app.get('/salary_details_read/:e_sal_emp_code', async (req, res) => {
  const employeeCode = req.params.e_sal_emp_code;

  console.log(employeeCode);
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM salary WHERE e_sal_emp_code =  '${employeeCode}'`
      // `SELECT * FROM salary WHERE e_sal_emp_code = '21471A05D5'`,
      // { code: employeeCode }
    );

    const employeeDetails = result.rows[0];
    console.log(employeeDetails);
    res.json(employeeDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error.message);
      }
    }
  }
});

app.get("/all_employee_details_Read", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from emp`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/all_salary_details_Read", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from salary`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/employee_detail_Read:_id", async (req, res) => {
  try {
    const emp_code = req.params._id;
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from emp where emp_code='${emp_code}'`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete("/delete_employee/:_id", async (req, res) => {
  try {
    const emp_code = req.params._id;
    console.log(emp_code);
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`delete from emp where emp_code = '${emp_code}'`);
    await connection.commit();
    // Release the connection back to the pool
    await connection.close();
    console.log(result);
    console.log('Data Deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.get("/Read:_ID", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from MUSEUMSLIST`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});

// {
// "emp_code":"1234",
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