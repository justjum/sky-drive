const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");

exports.index = async function (req, res, next) {
  let currentFolder,
    folders,
    parentFolders = [];
  if (!req.query.id) {
    currentFolder = await prisma.folder.findFirst({
      where: { userId: req.user.id, name: "Home" },
    });
  } else {
    currentFolder = await prisma.folder.findFirst({
      where: { id: req.query.id },
    });
  }

  console.log(`Current folder ${currentFolder}`);

  if (currentFolder == null) {
    console.log("Creating Home");
    await prisma.folder.create({
      data: {
        name: "Home",
        userId: req.user.id,
      },
    });

    currentFolder = await prisma.folder.findFirst({
      where: { userId: req.user.id },
    });
  }

  populateParents(currentFolder, parentFolders);

  folders = await prisma.folder.findMany({
    where: { userId: req.user.id, parentId: currentFolder.id },
  });

  let files = await prisma.file.findMany({
    where: { userId: req.user.id, folderId: currentFolder.id },
  });

  console.log(parentFolders);

  res.render("drive", {
    title: "Sky Drive",
    subtitle: "Sky Drive",
    user: req.user,
    parents: parentFolders,
    folders: folders,
    currentFolder: currentFolder,
    files: files,
  });
};

// Populate Parents function
async function populateParents(currentFolder, parentFolders) {
  if (currentFolder.parentId != null) {
    let parent = await prisma.folder.findFirst({
      where: { id: currentFolder.parentId },
    });
    parentFolders.unshift(parent);
    populateParents(parent, parentFolders);

    return parentFolders;
  }
}

exports.folderCreatePost = async function (req, res, next) {
  const newFolder = await prisma.folder.create({
    data: {
      name: req.body.newFolder,
      parentId: req.body.folderId,
      userId: req.user.id,
    },
  });
  res.redirect(`/drive/?id=${req.body.folderId}`);
};

exports.uploadFile = async function (req, res, next) {
  console.log("req.file object", req.file);
  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  try {
    const result = await cloudinary.uploader.upload(file64.content, {
      resource_type: "auto",
      folder: "Sky-Drive",
    });
    console.log(result);
    const uploaded = await prisma.file.create({
      data: {
        name: req.file.originalname,
        userId: req.user.id,
        folderId: req.body.folderId,
        href: result.secure_url,
        size: result.bytes,
        created: result.created_at,
        publicId: result.public_id,
      },
    });

    res.redirect(`/drive/?id=${req.body.folderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
};

exports.folderDeletePost = async function (req, res, next) {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: req.user.id,
        id: req.body.parent,
      },
    });
    console.log(folder);
    await prisma.folder.delete({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
    });
    res.redirect(`/drive/?id=${folder.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting folder from Drive" });
  }
};

exports.fileDeletePost = async function (req, res, next) {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: req.user.id,
        id: req.body.parent,
      },
    });
    const file = await prisma.file.findFirst({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
    });
    await prisma.file.delete({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
    });
    const result = await cloudinary.api
      .delete_resources([file.publicId], {
        type: "upload",
        resource_type: "image",
      })
      .then(console.log);
    res.redirect(`/drive/?id=${folder.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting file from Drive" });
  }
};

exports.folderUpdatePost = async function (req, res, next) {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: req.user.id,
        id: req.body.parent,
      },
    });
    const updateFolder = await prisma.folder.update({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
      data: {
        name: req.body.value,
      },
    });
    res.redirect(`/drive/?id=${folder.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating folder name." });
  }
};

exports.fileUpdatePost = async function (req, res, next) {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        userId: req.user.id,
        id: req.body.parent,
      },
    });
    const updateFile = await prisma.file.update({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
      data: {
        name: req.body.value,
      },
    });
    res.redirect(`/drive/?id=${folder.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating file name." });
  }
};
