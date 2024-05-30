var booleanParser = require('boolean-parser');
// const { parse } = require('boolean-parser');
const { Op } = require('sequelize');
const db = require('../models');
const File = db.File;

const parseBooleanString = (str) => {
    console.log("str", str);
    const parsed = booleanParser.parseBooleanQuery(str);
    return parsed;
};

const buildSequelizeQuery = (parsedQuery) => {
    console.log("parsedQuery", parsedQuery);
    const where = {};

    const processNode = (node) => {
        console.log("node", node);
        // if(node.type === 'AND'){
        //     return { [Op.and]: node.values.map(processNode) };
        // }
        if (Array.isArray(node)) {
            // console.log("node", node);
            // Handle the array of arrays directly
            const conditions = node.map(pair => processNode({ type: 'TERM', values: pair }));
            return { [Op.and]: conditions };
        } else if (node.type === 'AND' || node.type === 'OR') {
            console.log("node", node);
            const conditions = node.values.map(pair => processNode({ type: 'TERM', values: pair }));
            return node.type === 'AND' ? { [Op.and]: conditions } : { [Op.or]: conditions };
        } else if (node.type === 'NOT') {
            return { [Op.not]: processNode(node.values[0]) };
        } else if (node.type === 'TERM') {
            const keyword = node.values.map(value => value);
            console.log("keyword", keyword);
            // Search across specific fields for the keyword
            return {
                [Op.or]: [
                    { firstName: { [Op.iLike]: `%${keyword}%` } },
                    { lastName: { [Op.iLike]: `%${keyword}%` } },
                    { currentTitle: { [Op.iLike]: `%${keyword}%` } },
                    { desiredJobTitle: { [Op.iLike]: `%${keyword}%` } },
                    { fileName: { [Op.iLike]: `%${keyword}%` } },
                    { fileType: { [Op.iLike]: `%${keyword}%` } }
                ]
            };
        }
    };

    // Assuming parsedQuery is an array of arrays containing keywords
    Object.assign(where, processNode({ type: 'AND', values: parsedQuery }));

    return { where };
};


exports.searchFiles = async (req, res) => {
    try {
        const { searchString } = req.body;

        // Parse the search string
        const parsedQuery = parseBooleanString(searchString);
        // console.log("parsedQuery", parsedQuery);

        // Build the Sequelize query
        const queryConditions = buildSequelizeQuery(parsedQuery);
        console.log("queryConditions", queryConditions.where);

        // Fetch files from the database using the generated query
        const files = await File.findAll(queryConditions);

        // Map the files to the desired response format
        const mappedFiles = files.map((file) => ({
            id: file.dataValues.id,
            fileName: file.dataValues.fileName,
            fileType: file.dataValues.fileType,
            fileSize: file.dataValues.fileSize,
            firstName: file.dataValues.firstName,
            lastName: file.dataValues.lastName,
            currentTitle: file.dataValues.currentTitle,
            desiredJobTitle: file.dataValues.desiredJobTitle,
            salaryMin: file.dataValues.salaryMin,
            lookingFor: file.dataValues.lookingFor,
            updatedAt: file.dataValues.updatedAt,
        }));

        // Send the mapped files array as the response
        res.json(mappedFiles);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).send("Internal Server Error");
    }
};

