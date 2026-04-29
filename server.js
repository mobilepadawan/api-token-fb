import { AuthManager } from "./src/AuthManager.Class.js"
import { db } from "./src/firebase.js"
import { collection, getDocs, addDoc, writeBatch,
         getDoc, doc, query, where, or } from "firebase/firestore"
 
import express, { json } from 'express'

const app = express()
const PORT = 3000 || process.env.PORT 
const userList = []

app.use(json())

app.get('/', async (req, res) => {
         try {
            return res.status(200).json({
                 message: "Bienvenid@s a nuestra API Backend de TECLAB.",
                 APIName: "Ejemplo con API KEY - Teclab " + new Date().getFullYear(),
                 copyright: "Fernando Omar Luna",
                 version: "1.0.2026"
             })
         }
         catch (error) {
            return res.status(400).json( { message: "Error al acceder al endpoint.", errorMessage: error.message } )                  
         }
})

app.post("/list-all-users", async (req, res) => {
    try {
        const adminToken = req.headers['admintoken']

        if (!adminToken) {
            return res.status(401).json({ message: "Debes informar un token autorizado." });
        }

        const usersRef = collection(db, "users")
        const snapshot = await getDocs(usersRef)

        const users = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                email: data.email,
                nickname: data.nickname
            }
        })

        res.status(200).json(users)

    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            message: "Error al intentar listar los usuarios registrados.",
            errorMessage: error.message
        })
    }
})

app.get('/productos', async (req, res) => {    
    try {
        const userToken = req.headers['usertoken']
        if (!userToken) {
            return res.status(401).json({ message: "Token requerido." });
        }

        const userValidated = await AuthManager.validateUserByToken(userToken)

        if (userValidated) {
            const productosRef = collection(db, "productos")
            const snapshot = await getDocs(productosRef)
            const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            
            res.status(200).json(productos)
        } else {
            throw new Error('No se pudo validar al usuario.')
        }

    } catch (error) {
        console.error(error.message)
        res.status(400).json({
            message: "Error al obtener productos.",
            errorMessage: error.message
        })
    }
})

app.get("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const userToken = req.headers['usertoken']

        if (!userToken) {
            return res.status(401).json({ message: "Token requerido." });
        }

        if (!id) {
            return res.status(400).json({ message: "Se esperaba el código de producto." })
        }

        const userValidated = await AuthManager.validateUserByToken(userToken)

        if (userValidated) {
            const docRef = doc(db, "productos", id)
            const snapshot = await getDoc(docRef)

            if (!snapshot.exists()) {
                return res.status(404).json({ message: `No se encontró un producto con el ID: '${id}'` })
            }

            const resultado = {
                id: snapshot.id,
                ...snapshot.data()
            }

            return res.status(200).json(resultado)

        } else {
            throw new Error('No se pudo validar al usuario.')
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener producto",
            error: error.message
        })
    }
})

app.post("/productos", async (req, res) => {
    try {
        const userToken = req.headers['usertoken']
        if (!userToken) {
            return res.status(401).json({ message: "Token requerido." });
        }

        const userValidated = await AuthManager.validateUserByToken(userToken)

        if (userValidated) {
            const { nombre, precio, imagen, categoria } = req.body
            if (!precio || !categoria || !nombre || !imagen) {
                return res.status(400).json({
                    message: "Verifica los campos obligatorios: (nombre, precio, imagen, categoria)"
                })
            }

            const nuevoProducto = { nombre, precio, imagen, categoria }
            const docRef = await addDoc(collection(db, "productos"), nuevoProducto)
            return res.status(201).json({
                id: docRef.id,
                ...nuevoProducto
            })

        } else {
            throw new Error('No se pudo validar al usuario.')
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error al crear un nuevo producto.",
            error: error.message
        })
    }
})

app.get('/categorias', async (req, res) => {
    try {
        const userToken = req.headers['usertoken']
        if (!userToken) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const userValidated = await AuthManager.validateUserByToken(userToken)

        if (userValidated) {
            const categoriasRef = collection(db, "categorias")
            const snapshot = await getDocs(categoriasRef)
            const categorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

            return res.status(200).json(categorias)
        } else {
            throw new Error('No se pudo validar al usuario.')
        }

    } catch (error) {
        return res.status(400).json({
            message: "Error al obtener las Categorías.",
            errorMessage: error.message
        })
    }
})

app.post("/register", async (req, res) => {
    const { email, nickname } = req.body

    if (!email || !nickname) {
        return res.status(400).json({
            message: "Revisa los datos obligatorios (email, nickname)."
        })
    }

    try {

        const usersRef = collection(db, "users")
        const q = query(
            usersRef,
            or(
                where("email", "==", email),
                where("nickname", "==", nickname)
            )
        )

        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
            return res.status(400).json({ 
                message: "Por favor, revisa el usuario o email." 
            })
        }
        
        const tokenId = AuthManager.createToken()
        const newUser = { email, nickname, tokenId }
        const docRef = await addDoc(collection(db, "users"), newUser)

        return res.status(201).json({
            id: docRef.id,
            ...newUser
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el nuevo usuario.",
            error: error.message
        })
    }
})

app.get("/productos/categorias/:cate", async (req, res) => {
    try {
        const userToken = req.headers['usertoken']
        if (!userToken) {
            return res.status(401).json({ message: "Token requerido." });
        }

        const userValidated = await AuthManager.validateUserByToken(userToken)

        if (userValidated) { 
            let { cate } = req.params
            if (!cate) {
                return res.status(400).json({ message: "Debes enviar una categoría como parámetro." })
            }

            cate = cate.charAt(0).toUpperCase() + cate.slice(1).toLowerCase()
            const productosRef = collection(db, "productos")
            const q = query(
                productosRef,
                where("categoria", "==", cate)
            )

            const snapshot = await getDocs(q)
            const productos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            if (productos.length > 0) {
                return res.status(200).json(productos)
            } else {
                return res.status(404).json( { message: `No se encontraron productos en la categoría: ${cate}`} )
            }

        } else {
            throw new Error('No se pudo validar al usuario.')
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Error al filtrar los productos.",
            error: error.message
        })
    }
})

app.all('*', (req, res) => {
    res.status(404).json({ message: 'El endpoint indicado no existe.' })
})

app.listen(PORT, "0.0.0.0", () => console.log(`Servidor iniciado en el puerto ${PORT}`))
