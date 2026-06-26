package xs.core.interfaces.enumeration;

import java.io.Serializable;

import org.springframework.http.HttpMethod;

public class FileMGEnums implements Serializable {

	private static final long serialVersionUID = -656278850302533135L;

	public enum FILE_MG_API{

		CHECK_FILE					("check"				,"http"		,HttpMethod.POST),
		READ_FILE					("read"					,"http"		,HttpMethod.POST),
		WRITE_FILE					("write"				,"http"		,HttpMethod.POST),
		DELETE_FILE					("delete"				,"http"		,HttpMethod.POST),
		MOVE_FILE					("move"					,"http"		,HttpMethod.POST),
		MOVE_TO_WAVCONVERT			("moveToWaveConvert"	,"http"		,HttpMethod.POST),
		COPY_FILE					("copy"					,"http"		,HttpMethod.POST),
		SYNC_FILE					("syncCheck"			,"http"		,HttpMethod.POST),

		SAMPLE						(""						,"http"		,HttpMethod.POST);

		private String context;
		private String protocol;
		private HttpMethod methodType;

		private FILE_MG_API(String context, String protocol, HttpMethod methodType){
			this.context		= context;
			this.protocol		= protocol;
			this.methodType		= methodType;
		}

		public String getContext() {
			return context;
		}
		public void setContext(String context) {
			this.context = context;
		}
		public String getProtocol() {
			return protocol;
		}
		public void setProtocol(String protocol) {
			this.protocol = protocol;
		}
		public HttpMethod getMethodType() {
			return methodType;
		}
		public void setMethodType(HttpMethod methodType) {
			this.methodType = methodType;
		}
	}
}
