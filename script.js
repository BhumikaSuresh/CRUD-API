const express= require('express')
const cors = require('cors');
const mongoose=require('mongoose')
const Employee = require('./models/employee')
const app= express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/employees',async(req,res)=>
{
    try{
        let query={};
        if (req.query.Department) {
            query.Department = req.query.Department;
        }

        let sortOption = { name: 1 }; 

        if (req.query.sort === 'desc') {
            sortOption = { name: -1 }; 
        }

        const employees= await Employee.find(query).sort(sortOption);
        res.status(200).json(employees);
  }catch (error){
      res.status(500).json({message: error.message})
  }
})

app.get('/employee/:employeeId',async(req,res)=>
    {
        try{
            const {employeeId}= req.params;
            const employee= await Employee.findOne({employeeId});

            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            res.status(200).json(employee);
      }catch (error){
          res.status(500).json({message: error.message})
      }
    })

    app.get('/employee/:name',async(req,res)=>
        {
            try{
                const { name }= req.params;
                const employee= await Employee.findOne({ name });
    
                if (!employee) {
                    return res.status(404).json({ message: 'Employee not found' });
                }
    
                res.status(200).json(employee);
          }catch (error){
              res.status(500).json({message: error.message})
          }
        })

 app.put('/employee/:employeeId', async(req,res)=>{
            const{employeeId}=req.params;
            const {name, Department, isactive, employmentType } = req.body;
   try{

        if(!name && !Department && ! isactive && !employmentType){
            return res.status(404).json({message: 'Please provide details'})
        }
        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeId },
            { name, Department, isactive, employmentType },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
   }catch(error){
    res.status(500).json({message:error.message})
   }

 })

 app.delete('/employee/:employeeId',async(req,res) =>{
             const {employeeId}= req.params;
     try{
        const employee=await Employee.findOne({employeeId});
        if(!employee){
            return res.status(404).json({message:'Employee not found'})
        }
               if(employee.isactive ==='active'){
                return res.status(400).json({ message: 'Cannot delete active employee' });
               }
            
               await Employee.findOneAndDelete({employeeId});
 
        res.status(200).json({message: 'employee deleted successfully'});
    }
    catch(error){
        res.status(500).json({message:error.message})
       }
 })

app.post('/employee', async(req, res)=> {
    const {name, DOB, employeeId, Department, isactive,employementType } = req.body;
    try{
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }
        const newEmployee = new Employee({
            name,
             DOB,
              employeeId,
               Department, 
               isactive,
               employementType
        });

          const savedEmployee = await newEmployee.save();

          res.status(200).json(savedEmployee);
    }catch (error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
}) 


mongoose.connect('mongodb+srv://bhumikasuresh003:BHUMIKA@cluster0.asswpor.mongodb.net/nodeapi?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log('connected to MongoDB')
    app.listen(3000, ()=>{
        console.log('Node API app is running on port 3000')
    })
})
.catch((error)=>{
    console.log(error)
})