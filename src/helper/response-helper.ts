class responseHelper {
  public success(message: string, data?: any) {
    return {
      data,
      status: 'success',
      message,
    };
  }
  public error(message: string, data?: any) {
    return {
      data,
      status: 'error',
      message,
    };
  }
}

export default new responseHelper();
