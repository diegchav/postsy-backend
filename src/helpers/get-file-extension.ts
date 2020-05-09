export default (fileName: string) => {
    return fileName.split('.').pop() || ''
}