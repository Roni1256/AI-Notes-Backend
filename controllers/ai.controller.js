import {generateContentList, generateCoreContent} from "../AI/AI.js";

export async function ListingContent(req,res){
    try {
        const {prompt} = req.body;
        if(!prompt){
            return res.status(404).json({message:"Please provide a prompt"})
        }       
        console.log("Prompt: "+prompt);
        
        const response =await generateContentList(prompt);
        console.log("response: "+response);
        
        if(response.error){
            return res.status(500).json({
                message:"AI Error",
                error:response.error.message
            })
        }
        return res.status(200).json({
            message:"Content Generated",
            data:response
        })

    } catch (error) {
        return res.status(500).json({
            message:"Error occured in AI",
            error:error.message
        })
    }
}
export async function CoreContent(req,res){
    try {
        const {prompt,topic,item} = req.body;
        if(!prompt){
            return res.status(404).json({message:"Please provide a prompt"})
        }       
        console.log("Prompt: "+prompt);
        
        const response =await generateCoreContent(prompt,topic,item);
        console.log("response: "+response);
        
        if(response.error){
            return res.status(500).json({
                message:"AI Error",
                error:response.error.message
            })
        }
        return res.status(200).json({
            message:"Content Generated",
            data:response
        })

    } catch (error) {
        return res.status(500).json({
            message:"Error occured in AI",
            error:error.message
        })
    }
}