import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Template } from "../types";
import { templates as localTemplates } from "../data/seed";

export const getTemplates = async (category?: Template["category"]) => {
  try {
    const constraints = category
      ? [where("category", "==", category), orderBy("popularityScore", "desc")]
      : [orderBy("popularityScore", "desc")];

    const snapshot = await getDocs(query(collection(db, "templates"), ...constraints));
    const remoteTemplates = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Template);
    return remoteTemplates.length ? remoteTemplates : localTemplates;
  } catch {
    return localTemplates;
  }
};
