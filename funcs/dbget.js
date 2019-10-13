module.exports = async function (collection, doc, futox) {
  if (doc) {
    let d = await futox.db.collection(collection).doc(doc).get().catch(err => {
      console.log('Error getting document', err);
      return 'error';
    });
    return d.data();
  } else {
    let d = await futox.db.collection(collection).get().catch(err => {
      console.log('Error getting document', err);
      return 'error';
    });
    let finalD = [];
    d.forEach(doc => {
      finalD.push({
        id: doc.id,
        d: doc.data(),
      });
    });
    return finalD;
  }
};