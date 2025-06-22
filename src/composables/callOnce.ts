/**
 * A composable that ensures a function is called only once 
 * 
 * @param callback - The function to call on first mount
 */
const mountingMap = new Map<string, boolean>()
const hasBeenCalled = (key: string) => {
    if(!mountingMap.has(key)) {
        mountingMap.set(key, true)
        return false;
    }
    return true;
}
export function callOnce(key: string, callback: () => void | Promise<void>) {
    if(hasBeenCalled(key)) {
        return
    }
    return callback();
}