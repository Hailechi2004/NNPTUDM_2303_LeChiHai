var express = require("express");
var router = express.Router();
let { uploadImage, uploadExcel } = require('../utils/uploadHandler')
let path = require('path')
let fs = require('fs')
let exceljs = require('exceljs')
let productModel = require('../schemas/products')
let InventoryModel = require('../schemas/inventories')
const { default: mongoose } = require('mongoose');
var slugify = require('slugify')
const crypto = require('crypto');
let { sendAccountMail } = require('../utils/mailHandler');


let userModel = require('../schemas/users');
let roleModel = require('../schemas/roles');

router.post('/single', uploadImage.single('file'), function (req, res, next) {
    if (!req.file) {
        res.status(404).send({
            message: "file not found"
        })
    }
    res.send({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    })
})
router.post('/multiple', uploadImage.array('files', 5), function (req, res, next) {
    if (!req.files) {
        res.status(404).send({
            message: "file not found"
        })
    }
    console.log(req.files);
    let filesInfor = req.files.map(e => {
        return {
            filename: e.filename,
            path: e.path,
            size: e.size
        }
    })
    res.send(filesInfor)
})
router.get('/:filename', function (req, res, next) {
    let pathFile = path.join(__dirname, '../uploads', req.params.filename)
    res.sendFile(pathFile)
})

router.post('/excel/v1', uploadExcel.single('file'), async function (req, res, next) {
    let filePath = path.join(__dirname, '../uploads', req.file.filename);

    
    //workbook->n x worksheet-> n x row -> n x cell
    let workBook = new exceljs.Workbook();
    await workBook.xlsx.readFile(filePath);
    let workSheet = workBook.worksheets[0];
    let errors = [];
    let products = await productModel.find({});
    let productTitles = products.map(e => {
        return e.title
    })
    let productSkus = products.map(e => {
        return e.sku
    })
    let result = []
    for (let index = 2; index < workSheet.rowCount; index++) {
        let rowError = []
        let row = workSheet.getRow(index);
        let sku = row.getCell(1).value;
        let title = row.getCell(2).value;
        let category = row.getCell(3).value;
        let price = Number.parseInt(row.getCell(4).value);
        let stock = Number.parseInt(row.getCell(5).value);
        if (productSkus.includes(sku)) {
            rowError.push("sku bi trung "+sku)
        }
        if (productTitles.includes(title)) {
            rowError.push("title bi trung "+title)
        }
        if (price < 0 || isNaN(price)) {
            rowError.push("price khong hop le:  " + row.getCell(4).value)
        }
        if (stock < 0 || isNaN(stock)) {
            rowError.push("stock khong hop le " + row.getCell(5).value)
        }
        if (rowError.length > 0) {
            errors.push(rowError)
            result.push(rowError)
        } else {
            let session = await mongoose.startSession();
            session.startTransaction()
            try {
                let newItem = new productModel({
                    sku: sku,
                    title: title,
                    slug: slugify(title, {
                        replacement: '-',
                        remove: undefined,
                        lower: false,
                        strict: false,
                        locale: 'vi'
                    }),
                    price: price,
                    description: title,
                    category: category
                })
                //replica set
                let newProduct = await newItem.save({ session });
                console.log(newProduct);
                let newInventory = new InventoryModel({
                    product: newProduct._id,
                    stock: stock
                })
                newInventory = await newInventory.save({ session });
                await newInventory.populate('product')
                await session.commitTransaction()
                await session.endSession()
                productTitles.push(title);
                productSkus.push(sku)
                result.push(newInventory)
                //res.send(newInventory);
            } catch (errorCreate) {
                await session.abortTransaction()
                await session.endSession();
                errors.push(errorCreate.message)
                result.push(errorCreate.message)
            }
        }
    }
    res.send(result);
    fs.unlinkSync(filePath)

})

function normalizeExcelValue(value) {
    if (value == null) return '';

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value).trim();
    }

    if (typeof value === 'object') {
        if (value.result != null) return String(value.result).trim();
        if (value.text != null) return String(value.text).trim();
    }

    return String(value).trim();
}


router.post('/excel/v2', uploadExcel.single('file'), async function (req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Chưa upload file'
            });
        }

        let filePath = path.join(__dirname, '../uploads', req.file.filename);

        let workBook = new exceljs.Workbook();
        await workBook.xlsx.readFile(filePath);

        let workSheet = workBook.worksheets[0];

        let defaultRole = await roleModel.findOne({ name: 'user', isDeleted: false });
        if (!defaultRole) {
            return res.status(400).json({ message: 'Khong tim thay role mac dinh user' });
        }
        let errors = [];
        let result = [];

        let users = await userModel.find({});
        let usernames = users.map(u => u.username);
        let emails = users.map(u => u.email);

        for (let index = 2; index <= workSheet.rowCount; index++) {
            let row = workSheet.getRow(index);

            let username = normalizeExcelValue(row.getCell(1).value);
            let email = normalizeExcelValue(row.getCell(2).value);

            let rowError = [];

            if (!username) {
                rowError.push('username khong duoc trong');
            }

            if (!email) {
                rowError.push('email khong duoc trong');
            }

            if (usernames.includes(username)) {
                rowError.push('username bi trung: ' + username);
            }

            if (emails.includes(email)) {
                rowError.push('email bi trung: ' + email);
            }

            if (rowError.length > 0) {
                errors.push({
                    row: index,
                    errors: rowError
                });

                result.push({
                    row: index,
                    status: 'error',
                    userCreated: false,
                    mailSent: false,
                    errors: rowError
                });

                continue;
            }

            let password = crypto.randomBytes(8).toString('hex');

            try {
                let newUser = new userModel({
                    username: username,
                    email: email,
                    password: password,
                    role: defaultRole._id
                });

                await newUser.save();

                usernames.push(username);
                emails.push(email);

                try {
                    await sendAccountMail(email, username, password);

                    result.push({
                        row: index,
                        status: 'success',
                        userCreated: true,
                        mailSent: true,
                        user: {
                            username,
                            email,
                            role: defaultRole.name
                        }
                    });
                } catch (mailError) {
                    errors.push({
                        row: index,
                        errors: ['Tao user thanh cong nhung gui mail that bai: ' + mailError.message]
                    });

                    result.push({
                        row: index,
                        status: 'partial_success',
                        userCreated: true,
                        mailSent: false,
                        errors: ['Gui mail that bai: ' + mailError.message],
                        user: {
                            username,
                            email,
                            role: defaultRole.name
                        }
                    });
                }
            } catch (errorCreate) {
                errors.push({
                    row: index,
                    errors: [errorCreate.message]
                });

                result.push({
                    row: index,
                    status: 'error',
                    userCreated: false,
                    mailSent: false,
                    errors: [errorCreate.message]
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi xử lý file Excel',
            error: error.message
        });
    }
});

module.exports = router;