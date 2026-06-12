package xs.core.property;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import xs.core.utility.XtrmCryptoUtil;

/**
 * 어플리케이션에서 사용할 config 정보가 실제로 저장될 클래스.
 */
public class XtrmProperty {

	/** The Constant logger. */
	private static final Logger LOG = LoggerFactory.getLogger(XtrmProperty.class);

	/** 실제 config 정보가 저정될 properties 객체. */
	private Properties properties;

	public XtrmProperty() {
		LOG.info("ConfigProperties");
	}
	public final void init() {
		if (this.properties != null) {
			LOG.info("Initialize Config Variables");
		}
	}
	public final void setProperties(final Properties properties) {
		this.properties = properties;
	}
	public final String getString(final String strKey){
		return "SERVICE_MODE".equals(strKey) ? this.getServiceMode() : this.getString(strKey, "");
	}
	public final String getString(final String strKey, final String strDefault) {
		String strValue	= this.properties.getProperty(strKey);
		if(strValue == null || "".equals(strValue)) {
			strValue	= this.properties.getProperty(strKey + "_" + this.getServiceMode());
		}
		if(strValue == null){strValue = strDefault;}
		return decryptPropertyValue(strValue).trim();
	}

	public final int getInt(final String strKey){
		return getInt(strKey, 0);
	}
	public final int getInt(final String strKey, final int intDefault) {
		String strValue = this.getString(strKey);
		if(strValue == null || "".equals(strValue)){
			return intDefault;
		}else{
			return Integer.parseInt(strValue);
		}
	}

	public final long getLong(final String strKey){
		return getLong(strKey,0);
	}
	public final long getLong(final String strKey, final long lngDefault) {
		String strValue = this.getString(strKey);
		if(strValue == null || "".equals(strValue)){
			return lngDefault;
		}else{
			return Long.parseLong(strValue);
		}
	}

	public final float getFloat(final String strKey){
		return getFloat(strKey, 0);
	}
	public final float getFloat(final String strKey, final float fltDefault) {
		String strValue = this.getString(strKey);
		if(strValue == null || "".equals(strValue)){
			return fltDefault;
		}else{
			return Float.parseFloat(strValue);
		}
	}

	public final double getDouble(final String strKey){
		return getDouble(strKey, 0);
	}
	public final double getDouble(final String strKey, final double dblDefault) {
		String strValue = this.getString(strKey);
		if(strValue == null || "".equals(strValue)){
			return dblDefault;
		}else{
			return Double.parseDouble(strValue);
		}
	}

	public final boolean getBoolean(final String strKey){
		return getBoolean(strKey, false);
	}
	public final boolean getBoolean(final String strKey, final boolean blnDefault) {
		String strValue = this.getString(strKey);
		if(!"true".equals(strValue) && !"false".equals(strValue)){
			return blnDefault;
		}else{
			return Boolean.parseBoolean(strValue);
		}
	}

	public final Object getObject(final String strKey){
		return this.getObject(strKey, null);
	}
	public final Object getObject(final String strKey, final Object objDefault) {
		Object objValue	= this.properties.getProperty(strKey);
		if(objValue == null || "".equals(objValue.toString())) {
			objValue	= this.properties.getProperty(strKey + "_" + this.getServiceMode());
		}
		if(objValue == null){objValue = objDefault;}
		return decryptPropertyValue(objValue.toString());
	}

	public final String getServiceMode() {
		String strServiceMode = System.getProperty("service.mode");
		if( !(strServiceMode != null && strServiceMode.length() > 0)){
			return this.getString("SERVICE_MODE","");
		}
		return strServiceMode;
	}

	private String decryptPropertyValue(String strValue){
		String strEncryptValue	= new String();
		String strDecryptValue	= strValue;
		if(strValue.indexOf("ENC(") >= 0) {
			strEncryptValue		= strValue.substring(strValue.indexOf("ENC(")+4, strValue.length()-1);
			try {
				strDecryptValue = XtrmCryptoUtil.decryptAES(strEncryptValue);
			}catch (Exception e){
				strDecryptValue = strValue;
			}
		}
		strDecryptValue = strDecryptValue.replaceAll("\r|\n|\r|\r\n|\n\r", "");
		strDecryptValue = strDecryptValue.replaceAll("__SERVER", System.getProperty("server"));
//        LOG.info("getObject, strDecryptValue="+strDecryptValue);
		return strDecryptValue;
	}
}
