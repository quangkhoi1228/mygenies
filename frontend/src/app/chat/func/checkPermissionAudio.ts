export default async function checkPermissionAudio() {
  if (!navigator.permissions) {
    return false;
  }
  try {
    const status = await navigator.permissions.query({ name: "microphone" });

    if (status.state === "granted") {
      return true;
    }
    if (status.state === "denied") {
      return false;
    }
    return false;
  } catch (err) {
    return false;
  }
}
