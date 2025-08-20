import { Folder } from "../models/folder.model.js";
import { BSON } from "bson";

  export const createFolder=async(req,res)=>{
      try {
          const {id}=req.params
          const {name,description,maximumFiles,tags,files}=req.body

          if(!name || !description || !files){
              return res.status(400).json({message:"Missing Fields"})
          }
          const isFolderExists=await Folder.findOne({name:name, userId:id})
          if(isFolderExists){
              return res.status(409).json({message:"Folder Already Exists"});
          }

          const newFolder = new Folder({
              name,
              description,
              maximumFiles,
              tags,
              files,
              userId:id
          })

          const resp = await newFolder.save()

          return res.status(201).json({message:"Successfully Created a Folder",data:resp})
        
      } catch (error) {
          return res.status(500).json({message:error.message})
      }
  }

  export const updateFolder=async(req,res)=>{
    try {
        const {id, folderId} = req.params
                const {name, description, maximumFiles, tags, files} = req.body
        
                if(!name || !description || !files){
                    return res.status(400).json({message:"Missing Fields"})
                }
        
                const folder = await Folder.findById(folderId)
                if(!folder){
                    return res.status(404).json({message:"Folder Not Found"})
                }
        
                if(folder.userId.toString() !== id){
                    return res.status(403).json({message:"Not Authorized"})
                }
        
                const updatedFolder = await Folder.findByIdAndUpdate(
                    folderId,
                    {
                        name,
                        description,
                        maximumFiles,
                        tags,
                        files
                    },
                    {new: true}
                )
        
                return res.status(200).json({message:"Successfully Updated the Folder", data: updatedFolder})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
  }

  export const getAllFolders=async(req,res)=>{
    try {
        const {id}=req.params
        const allFolders=await Folder.find({userId:id})
        return res.status(200).json(allFolders)
    } catch (error) {
        
    }
  }

  function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${size} ${sizes[i]}`;
}
  export const folderSize=async (req, res) => {
  try {
    console.log(req.params.id);
    
    const folder = await Folder.findById(req.params.id).lean();
    if (!folder) return res.status(404).send(`Document not found ${folder} `);

    const sizeInBytes = BSON.calculateObjectSize(folder);

    const defSize=formatBytes(sizeInBytes,4)
    
    res.send(`Document size: ${defSize}`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
}

export const deleteFolder=async(req,res)=>{
    try {
        const {id,folderId}=req.params
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({message:"Folder Not Found"});
        }
        if (folder.userId.toString() !== id) {
            return res.status(403).json({message:"Not Authorized"});
        }
        await Folder.findByIdAndDelete(folderId);
        return res.status(200).json({message:"Successfully Deleted the Folder"});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English", "History", "Geography", "Economics", "Political Science",
  "Accountancy", "Business Studies", "Sociology", "Psychology", "Philosophy",
  "Environmental Science", "Statistics", "Zoology", "Botany", "Microbiology",
  "Biotechnology", "Astronomy", "Astrophysics", "Geology", "Oceanography",
  "Literature", "Creative Writing", "Linguistics", "French", "German",
  "Spanish", "Tamil", "Hindi", "Arabic", "Japanese",
  "Chinese", "Korean", "Russian", "Engineering Graphics", "Electronics",
  "Artificial Intelligence", "Machine Learning", "Data Science", "Cyber Security", "Blockchain",
  "Web Development", "Mobile App Development", "Software Engineering", "Database Management", "Operating Systems",
  "Networking", "Cloud Computing", "Ethical Hacking", "Information Technology", "Digital Marketing",
  "Media Studies", "Film Studies", "Music", "Dance", "Theatre",
  "Fine Arts", "Photography", "Design Thinking", "UI/UX Design", "Animation",
  "Game Design", "3D Modelling", "Interior Design", "Fashion Design", "Textile Design",
  "Culinary Arts", "Hotel Management", "Tourism Studies", "Aviation Management", "Logistics Management",
  "Entrepreneurship", "Project Management", "Finance", "Banking", "Investment Analysis",
  "Insurance Studies", "Marketing", "Human Resource Management", "Organizational Behaviour", "Business Law",
  "Criminology", "Forensic Science", "Law", "Legal Studies", "Public Administration",
  "Education", "Child Development", "Special Education", "Physical Education", "Sports Science",
  "Healthcare Management", "Nursing", "Pharmacy", "Medical Lab Technology", "Nutrition and Dietetics"
];


export const addFolderAuto=async(req,res)=>{
    try {
        const {id}=req.params
        for (const name of subjects) {
            await Folder.create({
                name: name,
                description: "sample",
                tags: ["sample"],
                files: [],
                userId: id
            })
        }
        res.status(200).json({ message: "All folders created successfully" })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
export const Size = async (req, res) => {
  try {
    console.log(typeof Folder.collection.stats());
    
    const stats = await Folder.collection.stats();
    // Optional: Convert to readable format
    // const defSize = formatBytes(stats.size, 2); 

    res.status(200).json({
      count: stats.count,
      bsonSize: stats.size,             // Total BSON document size in bytes
      storageSize: stats.storageSize,   // Physical disk space (bytes)
      avgObjSize: stats.avgObjSize      // Average BSON document size
      // sizeFormatted: defSize
    });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
};