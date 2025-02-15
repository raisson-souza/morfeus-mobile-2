import { firebaseApp } from "./api"
import { getFirestore, collection, query, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore"
import CHANGELOG, { Changelog } from "@/data/changelog"

export default abstract class FirestoreDb {
    private static db = getFirestore(firebaseApp)

    private static async getMorfeusDocuments() {
        const usersCollectionRef = collection(this.db, "morfeus")
        const q = query(usersCollectionRef)
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)
        return querySnapshot.docs[0].data()
    }

    static async getChangelog() {
        try {
            const changelog = await this.getMorfeusDocuments().then(result => result["changelog"] as Changelog[])
            return changelog.reverse()
        }
        catch {
            return CHANGELOG
        }
    }
}