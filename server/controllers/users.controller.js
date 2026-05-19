const Users= require('../models/users.model');

exports.registerUser= async (req,res)=>{
    try {
        const{name,email,password,role}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'Please provide all required fields'});
        }
        const user= new Users({
            name,
            email,
            password,
        });
        await user.save();
        res.status(201).json({message:'User registered successfully'});
    } catch (error) {
    const errorMessage= error.message || 'Server Error';
    res.status(500).json({message:errorMessage});     
    }}