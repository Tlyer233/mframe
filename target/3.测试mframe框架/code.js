
// let iv = _crypto.getRandomValues(new Uint8Array(16));
// let key = _crypto.getRandomValues(new Uint8Array(16));
// let data = new Uint8Array(12345);

// // 使用异步函数包裹含有await的代码
// (async function() {
//   // 加密函数需要一个 cryptokey 对象
//   const key_encoded = await _crypto.subtle.importKey(
//     "raw",
//     key.buffer,
//     "AES-CTR",
//     false,
//     ["encrypt", "decrypt"],
//   );
//   const encrypted_content = await _crypto.subtle.encrypt(
//     {
//       name: "AES-CTR",
//       counter: iv,
//       length: 128,
//     },
//     key_encoded,
//     data,
//   );

//   // Uint8Array
//   console.log(encrypted_content);
// })();


let iv = crypto.getRandomValues(new Uint8Array(16));
let key = crypto.getRandomValues(new Uint8Array(16));
let data = new Uint8Array(12345);

// 使用异步函数包裹含有await的代码
(async function() {
  // 加密函数需要一个 cryptokey 对象
  const key_encoded = await crypto.subtle.importKey(
    "raw",
    key.buffer,
    "AES-CTR",
    false,
    ["encrypt", "decrypt"],
  );
  const encrypted_content = await crypto.subtle.encrypt(
    {
      name: "AES-CTR",
      counter: iv,
      length: 128,
    },
    key_encoded,
    data,
  );

  // Uint8Array
  console.log(encrypted_content);
})();