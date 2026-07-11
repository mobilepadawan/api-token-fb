import { env } from 'process'
import { cors } from 'cors'
import express from 'express'
import { MdbClass } from './services/MdbClass.js'
import TokenManager from './services/TokenManager.Class.js'

// CONTROLLERS
import { helloWorld } from './controllers/helloworld-controller.js'
import { createAdminProfile } from './controllers/createadminprofile-controller.js'
import { recoverProfile } from './controllers/recoverprofile-controller.js'
import { getCategories } from './controllers/getcategories-controller.js'
import { createCategory } from './controllers/createcategory-controller.js'
import { getProducts } from './controllers/getproducts-controller.js'
import { getProductById } from './controllers/getproductbyid-controller.js'
import { createProduct } from './controllers/createproduct-controller.js'
import { updateProduct } from './controllers/updateproduct-controller.js'
import { softDeleteProduct } from './controllers/softdeleteproduct-controller.js'
import { filterProductsByName } from './controllers/filterproductsbyname-controller.js'
import { filterProductsByCategory } from './controllers/filterproductsbycategory-controller.js'
import { getMetrics } from './controllers/getMetrics-controller.js'
import { PwdHasher } from './services/PasswordHasher.class.js'

const app = express()
const PORT = process.env.PORT || 3000
const API = 'api/v1'

app.use(express.json(), cors())
// --- Routes ---
app.get(`/`, (req, res)=> res.redirect('/hello-world') )
app.get(`/hello-world`, helloWorld)
// ADMIN
app.post(`/create-admin-profile`, createAdminProfile)
app.get(`/recover-profile`, recoverProfile)
app.post(`/get-metrics`, getMetrics)
// CATEGORIES
app.get(`/categories`, getCategories)
app.post(`/categories`, createCategory)
// PRODUCTS
app.get(`/products`, getProducts)
app.get(`/products/:id`, getProductById)
app.get(`/products/name/:name`, filterProductsByName)
app.get(`/products/category/:categoryname`, filterProductsByCategory)
app.post(`/products`, createProduct)
app.put(`/products/:id`, updateProduct)
app.delete(`/products/:id`, softDeleteProduct)
// CUSTOMERS AND SHOPPING CART
app.post('/create-customer', async (req, res)=> {
    const { customerName, customerEmail, password } = req.body

    res.status(201).json({
        success: true,
        data: {
            customerId: crypto.randomUUID().replaceAll('-', ''),
            customerName: customerName,
            customerEmail: customerEmail,
            password: await PwdHasher.hashPassword(password),
            createdAt: Date.now()
        }
    })
})

app.post('/compare-pwd', async (req, res)=> {
    const { pwd } = req.body
    const hash = '9595f42cb548c40052cdb20c148d163d:a1237125c1dc82568336528e8477a26a76507004479b658877377223a446972a'

    const resultado = await PwdHasher.verifyPassword(pwd, hash)

    if (resultado) {
        res.status(200).json({success: resultado})
    } else {
        res.status(400).json({success: resultado})
    }
})

app.use((req, res) =>   res.status(404).json({ errorMessage: `Endpoint '${req.url}' no encontrado.` }) )

// --- Server Start ---
app.listen(PORT, () => {
    console.clear()
    console.log(`========================================================`)
    console.log(`🚀 Server running successfully!`)
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 API Endpoints available on http://localhost:${PORT}`)
    console.log(`========================================================`)
})