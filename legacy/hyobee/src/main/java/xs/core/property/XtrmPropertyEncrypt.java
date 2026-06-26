package xs.core.property;

import java.util.Arrays;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import xs.core.utility.XtrmCryptoUtil;
import xs.core.utility.XtrmNIOFileUtil;

@Slf4j
public class XtrmPropertyEncrypt {
	public static void main(String[] arg) throws Exception {

		String strFileFullPath	 = arg[0];
		String strSectionCode	 = arg[1].toLowerCase();
		
		boolean blnEncrypt		 = "encrypt".equals(strSectionCode);
		List<String> lstKeyToEnc = Arrays.asList("RMQ_PASSWORD", "RMQ_CLIENT_PASSWORD");
		
		if(strFileFullPath == null || "".equals(strFileFullPath) || !XtrmNIOFileUtil.existFile(strFileFullPath)){
			log.info("#####     does not exist file info     #####");
			return;
		}
		
		String strFileExtension = XtrmNIOFileUtil.getFileExtensionName(strFileFullPath);
		if(!"properties".equals(strFileExtension.toLowerCase())){
			log.info("#####     " + strFileExtension + " is not allowed file extension     #####");
			return;
		}
		
		byte[] objReadByte			= XtrmNIOFileUtil.readFile(strFileFullPath);
		String[] objReadFile		= new String(objReadByte).split("\r*\n");
		StringBuffer objSb			= new StringBuffer();
		for(int i = 0; i < objReadFile.length; i++){
			String strLine = objReadFile[i].trim();
			if("".equals(strLine) || strLine.startsWith("#") || strLine.indexOf("=") == -1){
				objSb.append(strLine + "\n");
				continue;
			}
			
			String strKeyName       = strLine.substring(0, strLine.indexOf("="));
			String strKeyNameNoMode = strKeyName.endsWith("_LOCAL") || strKeyName.endsWith("_DEV") || strKeyName.endsWith("_REAL")
					                  ? strKeyName.substring(0, strKeyName.lastIndexOf("_"))
					                  : strKeyName;
			String strValue	        = strLine.substring(strLine.indexOf("=") + 1);
			boolean blnToEnc        = lstKeyToEnc.contains(strKeyNameNoMode);
			boolean blnHasEnc       = strValue.startsWith("ENC(");
			String strValueNoEnc    = blnHasEnc ? strValue.substring(4, strValue.length()-1) : strValue;
			
			if(!blnToEnc || strValue.length() == 0) {
				objSb.append(strLine + "\n");
				continue;
			}
			

			objSb.append(strKeyName + "=");
			
			if(blnEncrypt){
				if(blnHasEnc) {
					objSb.append(strValue);
				} else {
					objSb.append("ENC(" + XtrmCryptoUtil.encryptAES(strValue) + ")");					
				}				
			}else{
				if(blnHasEnc) {
					objSb.append(XtrmCryptoUtil.decryptAES(strValueNoEnc));
				} else {
					objSb.append(strValue);
				}
			}
			
			objSb.append("\n");
		}
		XtrmNIOFileUtil.writeFile(strFileFullPath, objSb.toString().getBytes("UTF-8"), true, false);
		log.info("#####     " + strSectionCode + " success     #####");
	}
}
