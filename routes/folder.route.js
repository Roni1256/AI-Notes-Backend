import express from 'express'
import {  addFolderAuto, createFolder, deleteFolder, folderSize, getAllFolders, Size, updateFolder } from '../controllers/folder.controller.js'
const route=express.Router()


route.post('/new/:id',createFolder)
route.get('/all/:id',getAllFolders)
route.put('/:id/:folderId',updateFolder)
route.post('/:id',addFolderAuto)
route.get('/doc-size/:id', folderSize);
route.get('/doc-size/', Size);

route.delete('/:id/:folderId',deleteFolder)

export default route