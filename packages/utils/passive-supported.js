let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true;
    },
  });
  window.addEventListener('test', null, options);
} catch (err) {
  console.log(err);
}

export default passiveSupported;
