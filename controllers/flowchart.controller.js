import Flowchart from "../models/flowchart.model.js";

export async function createFlowchart(req,res){
    try {
        const {name,description}=req.body;
        console.log(name,description);
        
        if(!name || !description){
            return res.status(401).json({message:"Missing Data"});
        }
        const created=await Flowchart.create({
            name,description
        })
        created.save();
        return res.status(200).json({message:"Created Successfully",data:created})
    } catch (error) {
        
    }
}