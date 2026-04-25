import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "./firebase.js"

export class AuthManager {
    static version = "1.0.0"
    static copyright = "Fernando Omar Luna"

    static createToken() {
        return crypto.randomUUID().replaceAll("-", "")
    }

    static async validateUserByToken(tokenId) {
        try {
            if (!tokenId) return false
            const usersRef = collection(db, "users")
            const q = query(usersRef, where("tokenId", "==", tokenId))
            const snapshot = await getDocs(q)
            return !snapshot.empty
        } catch (error) {
            console.error("Error validando usuario:", error.message)
            return false
        }
    }
}