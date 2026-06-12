package xs.core.exception;

public class XtrmExceptionMap extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private String strErrorCode;
    private String strErrorMsg;
    private Exception objException;

    public Exception getException() {
        return objException;
    }

    public void setException(Exception e) {
        this.objException = e;
    }

    public String getErrorCode() {
        return strErrorCode;
    }

    public void setErrorCode(String strErrorCode) {
        this.strErrorCode = strErrorCode;
    }

    public String getErrorMsg() {
        return strErrorMsg;
    }

    public void setErrorMsg(String strErrorMsg) {
        this.strErrorMsg = strErrorMsg;
    }

    public XtrmExceptionMap(String strErrorCode) {
        this.strErrorCode	= strErrorCode;
    }

    public XtrmExceptionMap(Exception e) {
        this.objException	= e;
    }

    public XtrmExceptionMap(String strErrorCode, String strErrorMsg) {
        this.strErrorCode	= strErrorCode;
        this.strErrorMsg	= strErrorMsg;
    }

    public XtrmExceptionMap(Exception e, String strErrorCode, String strErrorMsg) {
        this.objException	= e;
        this.strErrorCode	= strErrorCode;
        this.strErrorMsg	= strErrorMsg;
    }
}
