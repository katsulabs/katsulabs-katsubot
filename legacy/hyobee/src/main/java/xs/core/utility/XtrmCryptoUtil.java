package xs.core.utility;

import java.io.File;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

@SuppressWarnings("unused")
public class XtrmCryptoUtil {

	private static final String M_AES_ENCRYPT_KEY	= "xtrmAdviserVoc012345678910111213";

	private static byte[] aes_ivBytes				= { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
	private static final int ARIA_BLOCK_SIZE		= 16;
	private static final char[] ARIA_HEX_DIGITS		= {'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};
	private static final int[][] ARIA_KRK			= {
		{0x517cc1b7, 0x27220a94, 0xfe13abe8, 0xfa9a6ee0},
		{0x6db14acc, 0x9e21c820, 0xff28b1d5, 0xef5de2b0},
		{0xdb92371d, 0x2126e970, 0x03249775, 0x04e8c90e}
	};
	private static final byte[] ARIA_S1				= new byte[256];
	private static final byte[] ARIA_S2				= new byte[256];
	private static final byte[] ARIA_X1				= new byte[256];
	private static final byte[] ARIA_X2				= new byte[256];
	private static final int[] TARIA_S1				= new int[256];
	private static final int[] TARIA_S2				= new int[256];
	private static final int[] TARIA_X1				= new int[256];
	private static final int[] TARIA_X2				= new int[256];
	private static boolean runARIAStatic			= false;
	private static int aria_keySize					= 0;
	private static int aria_numberOfRounds			= 0;
	private static byte[] aria_masterKey			= null;
	private static int[] aria_encRoundKeys			= null, aria_decRoundKeys = null;

	public static String encryptAES(String strOrg) throws Exception {
		return encryptAES(strOrg, M_AES_ENCRYPT_KEY);
	}
	public static String encryptAES(String strOrg, String strKey) throws Exception {
		byte[] textBytes = strOrg.getBytes("UTF-8");
		AlgorithmParameterSpec ivSpec = new IvParameterSpec(aes_ivBytes);
		SecretKeySpec newKey = new SecretKeySpec(strKey.getBytes("UTF-8"), "AES");
		Cipher cipher = null;
		cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, newKey, ivSpec);
		return Base64.encodeBase64String(cipher.doFinal(textBytes));
	}
	public static String encryptAES(String strOrg, String companyCode, String strKey) throws Exception {
		//회사코드와 기본 키값을 연결후 특수문자 제외
		String encryptKey = replaceSpecialCharacters(companyCode + strKey);
		//공통 AES Key로 키 값을 암호화
		String newEncryptKey = encryptAES(encryptKey, M_AES_ENCRYPT_KEY);
		// 암호화 키 제한 ( 32 byte ) 초과시 키 Length 제한
		newEncryptKey = newEncryptKey.length() > 32 ? newEncryptKey.substring(0,32) : newEncryptKey ;
		//암호화 값 리턴
		return encryptAES(strOrg, newEncryptKey);
	}
	public static String decryptAES(String strEnc, String strKey) throws Exception {
		byte[] textBytes = Base64.decodeBase64(strEnc);
		AlgorithmParameterSpec ivSpec = new IvParameterSpec(aes_ivBytes);
		SecretKeySpec newKey = new SecretKeySpec(strKey.getBytes("UTF-8"), "AES");
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, newKey, ivSpec);
		return new String(cipher.doFinal(textBytes), "UTF-8");
	}
	public static String decryptAES(String strEnc) throws Exception {
		return decryptAES(strEnc, M_AES_ENCRYPT_KEY);
	}
	public static String decryptAES(String strEnc, String companyCode, String strKey) throws Exception {
		//회사코드와 기본 키값을 연결후 특수문자 제외
		String dncryptKey = replaceSpecialCharacters(companyCode + strKey);
		//공통 AES Key로 키 값을 암호화
		String newDncryptKey = encryptAES(dncryptKey, M_AES_ENCRYPT_KEY);
		// 암호화 키 제한 ( 32 byte ) 초과시 키 Length 제한
		newDncryptKey = newDncryptKey.length() > 32 ? newDncryptKey.substring(0,32) : newDncryptKey ;
		//복호화 값 리턴
		return decryptAES(strEnc, newDncryptKey);
	}
	public static String encrypt(String plainText) throws Exception {
		Cipher cipher = Cipher.getInstance("AES");
		cipher.init(Cipher.ENCRYPT_MODE, generateKey(null));
		byte[] encrypted = cipher.doFinal(plainText.getBytes("UTF-8"));
		return asHexString(encrypted);
	}
	private static byte[] encryptAES(byte[] bytOrg, String strKey) throws Exception {
		AlgorithmParameterSpec ivSpec = new IvParameterSpec(aes_ivBytes);
		SecretKeySpec newKey = new SecretKeySpec(strKey.getBytes("UTF-8"), "AES");
		Cipher cipher = null;
		cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, newKey, ivSpec);
		return cipher.doFinal(bytOrg);
	}
	private static byte[] encryptAES(byte[] bytOrg) throws Exception {
		return encryptAES(bytOrg, M_AES_ENCRYPT_KEY);
	}
	public static String decrypt(String encryptedString) throws Exception {
		Cipher cipher = Cipher.getInstance("AES");
		cipher.init(Cipher.DECRYPT_MODE, generateKey(null));
		byte[] original = cipher.doFinal(toByteArray(encryptedString));
		return new String(original);
	}
	private static byte[] decryptAES(byte[] encrypted, String strKey) throws Exception {
		AlgorithmParameterSpec ivSpec = new IvParameterSpec(aes_ivBytes);
		SecretKeySpec newKey = new SecretKeySpec(strKey.getBytes("UTF-8"), "AES");
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, newKey, ivSpec);
		return cipher.doFinal(encrypted);
	}
	private static Key generateKey(String secretKey) throws UnsupportedEncodingException, NoSuchAlgorithmException {
		if (secretKey == null) {
			secretKey = M_AES_ENCRYPT_KEY;
		}
		byte[] key = (secretKey).getBytes("UTF-8");
		MessageDigest sha = MessageDigest.getInstance("SHA-1");
		key = sha.digest(key);
		key = Arrays.copyOf(key, ARIA_BLOCK_SIZE); // use only the first 128 bit
		KeyGenerator kgen = KeyGenerator.getInstance("AES");
		kgen.init(128); // 192 and 256 bits may not be available
		return new SecretKeySpec(key, "AES");
	}
	private static String asHexString(byte buf[]) {
		StringBuilder strbuf = new StringBuilder(buf.length * 2);
		int i;
		for (i = 0; i < buf.length; i++) {
			if (((int) buf[i] & 0xff) < 0x10) {
				strbuf.append("0");
			}
			strbuf.append(Long.toString((int) buf[i] & 0xff, 16));
		}
		return strbuf.toString();
	}
	private static byte[] toByteArray(String hexString) {
		int arrLength = hexString.length() >> 1;
		byte buf[] = new byte[arrLength];
		for (int ii = 0; ii < arrLength; ii++) {
			int index = ii << 1;
			String l_digit = hexString.substring(index, index + 2);
			buf[ii] = (byte) Integer.parseInt(l_digit, 16);
		}
		return buf;
	}
	private static byte[] decryptAES(byte[] encrypted) throws Exception {
		return decryptAES(encrypted, M_AES_ENCRYPT_KEY);
	}
	public static boolean fileEncryptAES(Object sourceFile, Object destinationFile, String strKey) throws Exception {
		return fileCryptoAES(sourceFile, destinationFile, strKey, true);
	}
	public static boolean fileEncryptAES(Object sourceFile, Object destinationFile) throws Exception {
		return fileCryptoAES(sourceFile, destinationFile, M_AES_ENCRYPT_KEY, true);
	}
	public static boolean fileEncryptAES(Object sourceFile, Object destinationFile, String companyCode, String strKey) throws Exception {
		//회사코드와 기본 키값을 연결후 특수문자 제외
		String encryptKey = replaceSpecialCharacters(companyCode + strKey);
		//공통 AES Key로 키 값을 암호화
		String newEncryptKey = encryptAES(encryptKey, M_AES_ENCRYPT_KEY);
		// 암호화 키 제한 ( 32 byte ) 초과시 키 Length 제한
		newEncryptKey = newEncryptKey.length() > 32 ? newEncryptKey.substring(0,32) : newEncryptKey ;
		//암호화 값 리턴
		return fileCryptoAES(sourceFile, destinationFile, newEncryptKey, true);
	}
	public static boolean fileDecryptAES(Object sourceFile, Object destinationFile, String strKey) throws Exception {
		return fileCryptoAES(sourceFile, destinationFile, strKey, false);
	}
	public static boolean fileDecryptAES(Object sourceFile, Object destinationFile) throws Exception {
		return fileCryptoAES(sourceFile, destinationFile, M_AES_ENCRYPT_KEY, false);
	}
	public static boolean fileDecryptAES(Object sourceFile, Object destinationFile, String companyCode, String strKey) throws Exception {
		//회사코드와 기본 키값을 연결후 특수문자 제외
		String dncryptKey = replaceSpecialCharacters(companyCode + strKey);
		//공통 AES Key로 키 값을 암호화
		String newDncryptKey = encryptAES(dncryptKey, M_AES_ENCRYPT_KEY);
		// 암호화 키 제한 ( 32 byte ) 초과시 키 Length 제한
		newDncryptKey = newDncryptKey.length() > 32 ? newDncryptKey.substring(0,32) : newDncryptKey ;
		//복호화 값 리턴
		return fileCryptoAES(sourceFile, destinationFile, newDncryptKey, false);
	}
	@SuppressWarnings("null")
	private static boolean fileCryptoAES(Object sourceFile, Object destinationFile, String strKey, boolean doEncrypt) throws Exception {
		boolean returnValue			= false;
		byte[] encryptFileBytes		= null;
		Path srcFilePath			= null;
		Path destFilePath			= null;
		if(sourceFile instanceof File){
			srcFilePath				= Paths.get(((File)sourceFile).getPath());
		}else if(sourceFile instanceof String){
			if(Files.exists(Paths.get((String)sourceFile))){
				srcFilePath			= Paths.get((String)sourceFile);
			}
		}else if(sourceFile instanceof Path){
			srcFilePath				= (Path)sourceFile;
		}
		if(srcFilePath != null){
			if(destinationFile instanceof File){
				destFilePath		= Paths.get(((File)destinationFile).getPath());
			}else if(destinationFile instanceof String){
				destFilePath		= Paths.get((String)destinationFile);
			}else if(destinationFile instanceof Path){
				destFilePath		= (Path)destinationFile;
			}
			FileChannel fileChannel	= null;
			try{
				if(Files.exists(destFilePath)){
					fileChannel	 	= FileChannel.open(destFilePath, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
				}else{
					if(!Files.exists(Paths.get(destFilePath.getParent().toString()))){
						Files.createDirectories(destFilePath.getParent());
					}
					fileChannel		= FileChannel.open(destFilePath, StandardOpenOption.WRITE, StandardOpenOption.CREATE);
				}
				fileChannel.write(ByteBuffer.wrap(doEncrypt ? encryptAES(Files.readAllBytes(srcFilePath), strKey) : decryptAES(Files.readAllBytes(srcFilePath), strKey)));
				returnValue			= true;
			}catch(Exception ex01){
			}finally{
				if(fileChannel != null && fileChannel.isOpen()){
					fileChannel.close();
				}
			}
		}
		return returnValue;
	}
	public static byte[] generateAESKey(int intBit) throws Exception {
		KeyGenerator kgen = KeyGenerator.getInstance("AES");
		kgen.init(intBit);
		SecretKey skey = kgen.generateKey();
		byte[] raw = skey.getEncoded();
		SecretKeySpec newKey = new SecretKeySpec(raw, "AES");
		return newKey.getEncoded();
	}
	public static String encryptARIA(String data, byte[] key, String charsetName) throws InvalidKeyException, UnsupportedEncodingException {
		byte[] bytes = encryptARIA(data.getBytes(charsetName), key);
		return Base64.encodeBase64String(bytes);
	}
	public static String decryptARIA(String data, byte[] key, String charsetName) throws InvalidKeyException, UnsupportedEncodingException {
		byte[] bytes = decryptARIA(Base64.decodeBase64(data), key);
		if(bytes == null){
			return null;
		}
		return new String(bytes, charsetName);
	}
	public static String encryptARIA(String data, byte[] key) throws InvalidKeyException {
		byte[] bytes = encryptARIA(data.getBytes(), key);
		return Base64.encodeBase64String(bytes);
	}
	public static String decryptARIA(String data, byte[] key) throws InvalidKeyException {
		byte[] bytes = decryptARIA(Base64.decodeBase64(data), key);
		if(bytes == null){
			return null;
		}
		return new String(bytes);
	}
	public static String encryptARIA(String data, String key, String charsetName) throws InvalidKeyException, UnsupportedEncodingException {
		byte[] bytes = encryptARIA(data.getBytes(charsetName), key);
		return Base64.encodeBase64String(bytes);
	}

	public static String decryptARIA(String data, String key, String charsetName) throws InvalidKeyException, UnsupportedEncodingException {
		byte[] bytes = decryptARIA(Base64.decodeBase64(data), key);
		if(bytes == null){
			return null;
		}
		return new String(bytes, charsetName);
	}
	public static String encryptARIA(String data, String key) throws InvalidKeyException {
		byte[] bytes = encryptARIA(data.getBytes(), key);
		return Base64.encodeBase64String(bytes);
	}
	public static String decryptARIA(String data, String key) throws InvalidKeyException {
		byte[] bytes = decryptARIA(Base64.decodeBase64(data), key);
		if(bytes == null){
			return null;
		}
		return new String(bytes);
	}
	public static String encryptSHA256(String strData,String strCharSet) throws NoSuchAlgorithmException, UnsupportedEncodingException{
		return encryptHASH(strData,"SHA-256",strCharSet);
	}
	public static String encryptSHA1(String strData,String strCharSet) throws NoSuchAlgorithmException, UnsupportedEncodingException{
		return encryptHASH(strData,"SHA-1",strCharSet);
	}
	public static String encryptMD5(String strData,String strCharSet) throws NoSuchAlgorithmException, UnsupportedEncodingException{
		return encryptHASH(strData,"MD5",strCharSet);
	}
	private static byte[] encryptARIA(byte[] data, byte[] key) throws InvalidKeyException {
		initARIA(key);
		byte[] in = padPKCS5(data, ARIA_BLOCK_SIZE);
		byte[] out = new byte[in.length];
	    for(int i = 0; i < in.length; i += ARIA_BLOCK_SIZE){
	    	encryptARIAEngine(in, i, out, i);
	    }
	    return out;
	}
	private static byte[] decryptARIA(byte[] data, byte[] key) throws InvalidKeyException {
		initARIA(key);
		byte[] out = new byte[data.length];
	    for(int i = 0; i < data.length; i += ARIA_BLOCK_SIZE){
	    	decryptARIAEngine(data, i, out, i);
	    }
	    return unpadPKCS5(out, ARIA_BLOCK_SIZE);
	}
	private static byte[] encryptARIA(byte[] data, String key) throws InvalidKeyException {
		initARIA(key);
		byte[] in = padPKCS5(data, ARIA_BLOCK_SIZE);
		byte[] out = new byte[in.length];
	    for(int i = 0; i < in.length; i += ARIA_BLOCK_SIZE){
	    	encryptARIAEngine(in, i, out, i);
	    }
	    return out;
	}
	private static byte[] decryptARIA(byte[] data, String key) throws InvalidKeyException {
		initARIA(key);
		byte[] out = new byte[data.length];
	    for(int i = 0; i < data.length; i += ARIA_BLOCK_SIZE){
	    	decryptARIAEngine(data, i, out, i);
	    }
	    return unpadPKCS5(out, ARIA_BLOCK_SIZE);
	}
	/**
	 * ARIA는 key 사이즈가 128, 192, 256 bit 중에 하나 이어야만 한다.
	 * 아래는 단순 MD5를 돌려서 128 bit 키를 만들어낸다. 이 부분을 필요에 따라
	 * 상속하여 문자열에서 적절한 key를 생성하도록 변경하면 된다. (그냥 써도 무방하다)
	 * @param key
	 * @return key 사이즈 규격에 맞는 byte 배
	 * @throws InvalidKeyException
	 */
	private static void initARIA(String key) throws InvalidKeyException {
		MessageDigest algorithm = null;
        try{
			algorithm = MessageDigest.getInstance("SHA-256");
	        algorithm.reset();
	        algorithm.update(key.getBytes());
	        initARIA(algorithm.digest());
		}catch(NoSuchAlgorithmException e){
			throw new InvalidKeyException(e);
		}
	}
	private static void initARIA(byte[] key) throws InvalidKeyException {
		if(aria_keySize == 0 || key.clone() != aria_masterKey){
			setARIAKeySize(key.length * 8);
			setARIAKey(key);
			setupARIARoundKeys();
			if(!runARIAStatic){
				runARIAStatic						= true;
				int[] exp	= new int[256];
			    int[] log	= new int[256];
			    exp[0]		= 1;
			    for(int i = 1; i < 256; i++){
			    	int j = (exp[i-1] << 1) ^ exp[i-1];
			    	if((j & 0x100) != 0){
			    		j ^= 0x11b;
			    	}
			    	exp[i] = j;
			    }
			    for(int i=1; i < 255; i++){
			    	log[exp[i]] = i;
			    }
			    int[][] A = {
			    	{1, 0, 0, 0, 1, 1, 1, 1},
			        {1, 1, 0, 0, 0, 1, 1, 1},
			        {1, 1, 1, 0, 0, 0, 1, 1},
			        {1, 1, 1, 1, 0, 0, 0, 1},
			        {1, 1, 1, 1, 1, 0, 0, 0},
			        {0, 1, 1, 1, 1, 1, 0, 0},
			        {0, 0, 1, 1, 1, 1, 1, 0},
			        {0, 0, 0, 1, 1, 1, 1, 1}
			    };
			    int[][] B = {
			    	{0, 1, 0, 1, 1, 1, 1, 0},
			        {0, 0, 1, 1, 1, 1, 0, 1},
			        {1, 1, 0, 1, 0, 1, 1, 1},
			        {1, 0, 0, 1, 1, 1, 0, 1},
			        {0, 0, 1, 0, 1, 1, 0, 0},
			        {1, 0, 0, 0, 0, 0, 0, 1},
			        {0, 1, 0, 1, 1, 1, 0, 1},
			        {1, 1, 0, 1, 0, 0, 1, 1}
			    };
			    for(int i = 0; i < 256; i++){
			        int t=0, p;
			        if(i == 0){
						p = 0;
					}else{
						p = exp[255-log[i]];
					}
			        for(int j=0; j<8; j++){
			        	int s=0;
			        	for (int k=0; k<8; k++) {
			        		if (((p>>>(7-k))&0x01)!=0) {
			        			s^=A[k][j];
			        		}
			        	}
			        	t = (t<<1)^s;
			        }
			        t ^= 0x63;
			        ARIA_S1[i] = (byte)t;
			        ARIA_X1[t] = (byte)i;
			    }
			    for(int i = 0; i < 256; i++){
			    	int t = 0, p;
			    	if(i == 0){
			    		p = 0;
			    	}else{
			    		p = exp[(247*log[i])%255];
			    	}
			    	for(int j = 0; j < 8; j++){
			    		int s = 0;
			    		for(int k = 0; k < 8; k++){
			    			if(((p >>> k) & 0x01) != 0){
			    				s ^= B[7-j][k];
			    			}
			    		}
			    		t = (t << 1) ^ s;
			    	}
			    	t ^= 0xe2;
			    	ARIA_S2[i] = (byte) t;
			    	ARIA_X2[t] = (byte) i;
			    }
			    for(int i = 0; i < 256; i++){
			    	TARIA_S1[i] = 0x00010101*(ARIA_S1[i]&0xff);
			    	TARIA_S2[i] = 0x01000101*(ARIA_S2[i]&0xff);
			    	TARIA_X1[i] = 0x01010001*(ARIA_X1[i]&0xff);
			    	TARIA_X2[i] = 0x01010100*(ARIA_X2[i]&0xff);
			    }
			}
		}
	}
	private static int getARIAKeySize(){
		return aria_keySize;
	}
	private static void setARIAKeySize(int keySize) throws InvalidKeyException {
		/**
		 * Resets the class so that it can be reused for another master key.
		 */
		aria_keySize								= 0;
		aria_numberOfRounds							= 0;
		aria_masterKey								= null;
		aria_encRoundKeys							= null;
		aria_decRoundKeys							= null;
		if(keySize != 128 && keySize != 192 && keySize != 256){
			throw new InvalidKeyException("keySize=" + keySize);
		}
		aria_keySize								= keySize;
		switch(keySize){
			case 128:
				aria_numberOfRounds					= 12;
				break;
	        case 192:
	        	aria_numberOfRounds					= 14;
	        	break;
	        case 256:
	        	aria_numberOfRounds					= 16;
		}
	}
	private static void setARIAKey(byte[] masterKey) throws InvalidKeyException {
		if(masterKey.length*8 < aria_keySize){
			throw new InvalidKeyException("masterKey size=" + masterKey.length);
		}
		aria_decRoundKeys							= null;
		aria_encRoundKeys							= null;
		aria_masterKey								= masterKey.clone();
	}
	private static void setupARIAEncRoundKeys() throws InvalidKeyException {
	    if(aria_keySize == 0){
	    	throw new InvalidKeyException("keySize");
	    }
	    if(aria_masterKey == null){
			throw new InvalidKeyException("masterKey");
		}
	    if(aria_encRoundKeys == null){
			aria_encRoundKeys						= new int[4*(aria_numberOfRounds + 1)];
		}
	    aria_decRoundKeys							= null;
	    doARIAEncKeySetup(aria_masterKey, aria_encRoundKeys, aria_keySize);
	}
	private static void setupARIADecRoundKeys() throws InvalidKeyException {
		if(aria_keySize == 0){
			throw new InvalidKeyException("keySize");
		}
		if(aria_encRoundKeys == null){
			if(aria_masterKey == null){
				throw new InvalidKeyException("masterKey");
			}else{
				setupARIAEncRoundKeys();
			}
		}
		aria_decRoundKeys							= aria_encRoundKeys.clone();
		doARIADecKeySetup(aria_masterKey, aria_decRoundKeys, aria_keySize);
	}
	private static void setupARIARoundKeys() throws InvalidKeyException {
		setupARIADecRoundKeys();
	}
	private static void doCryptARIA(byte[] i, int ioffset, int[] rk, int nr, byte[] o, int ooffset) {
		int t0, t1, t2, t3, j = 0;
	    t0											= toInt(i[ 0+ioffset], i[ 1+ioffset], i[ 2+ioffset], i[ 3+ioffset]);
	    t1 											= toInt(i[ 4+ioffset], i[ 5+ioffset], i[ 6+ioffset], i[ 7+ioffset]);
	    t2											= toInt(i[ 8+ioffset], i[ 9+ioffset], i[10+ioffset], i[11+ioffset]);
	    t3											= toInt(i[12+ioffset], i[13+ioffset], i[14+ioffset], i[15+ioffset]);
	    for(int r = 1; r < nr/2; r++){
	    	t0 ^= rk[j++]; t1 ^= rk[j++]; t2 ^= rk[j++]; t3 ^= rk[j++];
	        t0 = TARIA_S1[(t0>>>24)&0xff]^TARIA_S2[(t0>>>16)&0xff]^TARIA_X1[(t0>>>8)&0xff]^TARIA_X2[t0&0xff];
	        t1 = TARIA_S1[(t1>>>24)&0xff]^TARIA_S2[(t1>>>16)&0xff]^TARIA_X1[(t1>>>8)&0xff]^TARIA_X2[t1&0xff];
	        t2 = TARIA_S1[(t2>>>24)&0xff]^TARIA_S2[(t2>>>16)&0xff]^TARIA_X1[(t2>>>8)&0xff]^TARIA_X2[t2&0xff];
	        t3 = TARIA_S1[(t3>>>24)&0xff]^TARIA_S2[(t3>>>16)&0xff]^TARIA_X1[(t3>>>8)&0xff]^TARIA_X2[t3&0xff];
	        t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	        t1 = ARIAbadc(t1); t2 = ARIAcdab(t2); t3 = ARIAdcba(t3);
	        t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	        t0 ^= rk[j++]; t1 ^= rk[j++]; t2 ^= rk[j++]; t3 ^= rk[j++];
	        t0 = TARIA_X1[(t0>>>24)&0xff]^TARIA_X2[(t0>>>16)&0xff]^TARIA_S1[(t0>>>8)&0xff]^TARIA_S2[t0&0xff];
	        t1 = TARIA_X1[(t1>>>24)&0xff]^TARIA_X2[(t1>>>16)&0xff]^TARIA_S1[(t1>>>8)&0xff]^TARIA_S2[t1&0xff];
	        t2 = TARIA_X1[(t2>>>24)&0xff]^TARIA_X2[(t2>>>16)&0xff]^TARIA_S1[(t2>>>8)&0xff]^TARIA_S2[t2&0xff];
	        t3 = TARIA_X1[(t3>>>24)&0xff]^TARIA_X2[(t3>>>16)&0xff]^TARIA_S1[(t3>>>8)&0xff]^TARIA_S2[t3&0xff];
	        t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	        t3 = ARIAbadc(t3); t0 = ARIAcdab(t0); t1 = ARIAdcba(t1);
	        t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    }
	    t0 ^= rk[j++]; t1 ^= rk[j++]; t2 ^= rk[j++]; t3 ^= rk[j++];
	    t0 = TARIA_S1[(t0>>>24)&0xff]^TARIA_S2[(t0>>>16)&0xff]^TARIA_X1[(t0>>>8)&0xff]^TARIA_X2[t0&0xff];
	    t1 = TARIA_S1[(t1>>>24)&0xff]^TARIA_S2[(t1>>>16)&0xff]^TARIA_X1[(t1>>>8)&0xff]^TARIA_X2[t1&0xff];
	    t2 = TARIA_S1[(t2>>>24)&0xff]^TARIA_S2[(t2>>>16)&0xff]^TARIA_X1[(t2>>>8)&0xff]^TARIA_X2[t2&0xff];
	    t3 = TARIA_S1[(t3>>>24)&0xff]^TARIA_S2[(t3>>>16)&0xff]^TARIA_X1[(t3>>>8)&0xff]^TARIA_X2[t3&0xff];
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t1 = ARIAbadc(t1); t2 = ARIAcdab(t2); t3 = ARIAdcba(t3);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t0 ^= rk[j++]; t1 ^= rk[j++]; t2 ^= rk[j++]; t3 ^= rk[j++];
	    o[ 0+ooffset] 								= (byte)(ARIA_X1[0xff&(t0>>>24)] ^ (rk[j  ]>>>24));
	    o[ 1+ooffset] 								= (byte)(ARIA_X2[0xff&(t0>>>16)] ^ (rk[j  ]>>>16));
	    o[ 2+ooffset] 								= (byte)(ARIA_S1[0xff&(t0>>> 8)] ^ (rk[j  ]>>> 8));
	    o[ 3+ooffset] 								= (byte)(ARIA_S2[0xff&(t0     )] ^ (rk[j  ]     ));
	    o[ 4+ooffset] 								= (byte)(ARIA_X1[0xff&(t1>>>24)] ^ (rk[j+1]>>>24));
	    o[ 5+ooffset] 								= (byte)(ARIA_X2[0xff&(t1>>>16)] ^ (rk[j+1]>>>16));
	    o[ 6+ooffset] 								= (byte)(ARIA_S1[0xff&(t1>>> 8)] ^ (rk[j+1]>>> 8));
	    o[ 7+ooffset] 								= (byte)(ARIA_S2[0xff&(t1     )] ^ (rk[j+1]     ));
	    o[ 8+ooffset] 								= (byte)(ARIA_X1[0xff&(t2>>>24)] ^ (rk[j+2]>>>24));
	    o[ 9+ooffset] 								= (byte)(ARIA_X2[0xff&(t2>>>16)] ^ (rk[j+2]>>>16));
	    o[10+ooffset] 								= (byte)(ARIA_S1[0xff&(t2>>> 8)] ^ (rk[j+2]>>> 8));
	    o[11+ooffset] 								= (byte)(ARIA_S2[0xff&(t2     )] ^ (rk[j+2]     ));
	    o[12+ooffset] 								= (byte)(ARIA_X1[0xff&(t3>>>24)] ^ (rk[j+3]>>>24));
	    o[13+ooffset] 								= (byte)(ARIA_X2[0xff&(t3>>>16)] ^ (rk[j+3]>>>16));
	    o[14+ooffset] 								= (byte)(ARIA_S1[0xff&(t3>>> 8)] ^ (rk[j+3]>>> 8));
	    o[15+ooffset] 								= (byte)(ARIA_S2[0xff&(t3     )] ^ (rk[j+3]     ));
	}
	private static void encryptARIAEngine(byte[] i, int ioffset, byte[] o, int ooffset) throws InvalidKeyException {
		if(aria_keySize == 0){
			throw new InvalidKeyException("keySize");
		}
		if(aria_encRoundKeys == null){
			if(aria_masterKey == null){
				throw new InvalidKeyException("masterKey");
			}else{
				setupARIAEncRoundKeys();
			}
		}
		doCryptARIA(i, ioffset, aria_encRoundKeys, aria_numberOfRounds, o, ooffset);
	}
	private static byte[] encryptARIAEngine(byte[] i, int ioffset) throws InvalidKeyException {
		byte[] o									= new byte[16];
		encryptARIAEngine(i, ioffset, o, 0);
		return o;
	}
	private static void decryptARIAEngine(byte[] i, int ioffset, byte[] o, int ooffset) throws InvalidKeyException {
		if(aria_keySize == 0){
			throw new InvalidKeyException("keySize");
		}
		if(aria_decRoundKeys == null){
			if(aria_masterKey == null){
				throw new InvalidKeyException("masterKey");
			}else{
				setupARIADecRoundKeys();
			}
		}
		doCryptARIA(i, ioffset, aria_decRoundKeys, aria_numberOfRounds, o, ooffset);
	}
	private static byte[] decryptARIAEngine(byte[] i, int ioffset) throws InvalidKeyException {
		byte[] o									= new byte[16];
		decryptARIAEngine(i, ioffset, o, 0);
		return o;
	}
	private static void doARIAEncKeySetup(byte[] mk, int[] rk, int keyBits) {
	    int t0, t1, t2, t3, q, j = 0;
	    int[] w0									= new int[4];
	    int[] w1									= new int[4];
	    int[] w2									= new int[4];
	    int[] w3									= new int[4];
	    w0[0]										= toInt(mk[ 0], mk[ 1], mk[ 2], mk[ 3]);
	    w0[1]										= toInt(mk[ 4], mk[ 5], mk[ 6], mk[ 7]);
	    w0[2]										= toInt(mk[ 8], mk[ 9], mk[10], mk[11]);
	    w0[3]										= toInt(mk[12], mk[13], mk[14], mk[15]);
	    q											= (keyBits - 128) / 64;
	    t0 = w0[0]^ARIA_KRK[q][0]; t1 = w0[1]^ARIA_KRK[q][1];
	    t2 = w0[2]^ARIA_KRK[q][2]; t3 = w0[3]^ARIA_KRK[q][3];
	    t0 = TARIA_S1[(t0>>>24)&0xff]^TARIA_S2[(t0>>>16)&0xff]^TARIA_X1[(t0>>>8)&0xff]^TARIA_X2[t0&0xff];
	    t1 = TARIA_S1[(t1>>>24)&0xff]^TARIA_S2[(t1>>>16)&0xff]^TARIA_X1[(t1>>>8)&0xff]^TARIA_X2[t1&0xff];
	    t2 = TARIA_S1[(t2>>>24)&0xff]^TARIA_S2[(t2>>>16)&0xff]^TARIA_X1[(t2>>>8)&0xff]^TARIA_X2[t2&0xff];
	    t3 = TARIA_S1[(t3>>>24)&0xff]^TARIA_S2[(t3>>>16)&0xff]^TARIA_X1[(t3>>>8)&0xff]^TARIA_X2[t3&0xff];
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t1 = ARIAbadc(t1); t2 = ARIAcdab(t2); t3 = ARIAdcba(t3);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    if(keyBits > 128){
	    	w1[0] = toInt(mk[16], mk[17], mk[18], mk[19]);
	    	w1[1] = toInt(mk[20], mk[21], mk[22], mk[23]);
	    	if(keyBits > 192){
	    		w1[2] = toInt(mk[24], mk[25], mk[26], mk[27]);
	    		w1[3] = toInt(mk[28], mk[29], mk[30], mk[31]);
	    	}else{
	    		w1[2] = w1[3]=0;
	    	}
	    }else{
	    	w1[0] = w1[1] = w1[2] = w1[3] = 0;
	    }
	    w1[0] ^= t0; w1[1] ^= t1; w1[2] ^= t2; w1[3] ^= t3;
	    t0 = w1[0]; t1 = w1[1]; t2 = w1[2]; t3 = w1[3];
	    q = (q == 2)? 0 : (q + 1);
	    t0 ^= ARIA_KRK[q][0]; t1^=ARIA_KRK[q][1]; t2^=ARIA_KRK[q][2]; t3^=ARIA_KRK[q][3];
	    t0 = TARIA_X1[(t0>>>24)&0xff]^TARIA_X2[(t0>>>16)&0xff]^TARIA_S1[(t0>>>8)&0xff]^TARIA_S2[t0&0xff];
	    t1 = TARIA_X1[(t1>>>24)&0xff]^TARIA_X2[(t1>>>16)&0xff]^TARIA_S1[(t1>>>8)&0xff]^TARIA_S2[t1&0xff];
	    t2 = TARIA_X1[(t2>>>24)&0xff]^TARIA_X2[(t2>>>16)&0xff]^TARIA_S1[(t2>>>8)&0xff]^TARIA_S2[t2&0xff];
	    t3 = TARIA_X1[(t3>>>24)&0xff]^TARIA_X2[(t3>>>16)&0xff]^TARIA_S1[(t3>>>8)&0xff]^TARIA_S2[t3&0xff];
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t3 = ARIAbadc(t3); t0=ARIAcdab(t0); t1=ARIAdcba(t1);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t0 ^= w0[0]; t1 ^= w0[1]; t2 ^= w0[2]; t3 ^= w0[3];
	    w2[0] = t0; w2[1] = t1; w2[2] = t2; w2[3] = t3;
	    q = (q == 2) ? 0 : (q + 1);
	    t0 ^= ARIA_KRK[q][0]; t1^=ARIA_KRK[q][1]; t2^=ARIA_KRK[q][2]; t3^=ARIA_KRK[q][3];
	    t0 = TARIA_S1[(t0>>>24)&0xff]^TARIA_S2[(t0>>>16)&0xff]^TARIA_X1[(t0>>>8)&0xff]^TARIA_X2[t0&0xff];
	    t1 = TARIA_S1[(t1>>>24)&0xff]^TARIA_S2[(t1>>>16)&0xff]^TARIA_X1[(t1>>>8)&0xff]^TARIA_X2[t1&0xff];
	    t2 = TARIA_S1[(t2>>>24)&0xff]^TARIA_S2[(t2>>>16)&0xff]^TARIA_X1[(t2>>>8)&0xff]^TARIA_X2[t2&0xff];
	    t3 = TARIA_S1[(t3>>>24)&0xff]^TARIA_S2[(t3>>>16)&0xff]^TARIA_X1[(t3>>>8)&0xff]^TARIA_X2[t3&0xff];
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t1 = ARIAbadc(t1); t2 = ARIAcdab(t2); t3 = ARIAdcba(t3);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    w3[0] = t0^w1[0]; w3[1] = t1^w1[1]; w3[2] = t2^w1[2]; w3[3] = t3^w1[3];
	    ARIAgsrk(w0, w1, 19, rk, j); j += 4;
	    ARIAgsrk(w1, w2, 19, rk, j); j += 4;
	    ARIAgsrk(w2, w3, 19, rk, j); j += 4;
	    ARIAgsrk(w3, w0, 19, rk, j); j += 4;
	    ARIAgsrk(w0, w1, 31, rk, j); j += 4;
	    ARIAgsrk(w1, w2, 31, rk, j); j += 4;
	    ARIAgsrk(w2, w3, 31, rk, j); j += 4;
	    ARIAgsrk(w3, w0, 31, rk, j); j += 4;
	    ARIAgsrk(w0, w1, 67, rk, j); j += 4;
	    ARIAgsrk(w1, w2, 67, rk, j); j += 4;
	    ARIAgsrk(w2, w3, 67, rk, j); j += 4;
	    ARIAgsrk(w3, w0, 67, rk, j); j += 4;
	    ARIAgsrk(w0, w1, 97, rk, j); j += 4;
	    if(keyBits > 128){
	    	ARIAgsrk(w1, w2, 97, rk, j); j += 4;
	    	ARIAgsrk(w2, w3, 97, rk, j); j += 4;
	    }
	    if(keyBits > 192){
	    	ARIAgsrk(w3, w0,  97, rk, j); j += 4;
	    	ARIAgsrk(w0, w1, 109, rk, j);
	    }
	}
	/**
	 * Main bulk of the decryption key setup method.  Here we assume that
	 * the int array rk already contains the encryption round keys.
	 * @param mk the master key
	 * @param rk the array which contains the encryption round keys at the
	 * beginning of the method execution.  At the end of method execution
	 * this will hold the decryption round keys.
	 * @param keyBits the length of the master key
	 * @return
	 */
	private static void doARIADecKeySetup(byte[] mk, int[] rk, int keyBits) {
		int a = 0, z;
		int[] t = new int[4];
	    z = 32 + keyBits/8;
	    swapBlocks(rk, 0, z);
	    a += 4; z -= 4;
	    for(; a < z; a += 4, z -= 4){
			ARIAswapAndDiffuse(rk, a, z, t);
		}
	    ARIAdiff(rk, a, t, 0);
	    rk[a] = t[0]; rk[a+1] = t[1]; rk[a+2] = t[2]; rk[a+3] = t[3];
	}
	private static int toInt(byte b0, byte b1, byte b2, byte b3) {
	    return (b0&0xff)<<24 ^ (b1&0xff)<<16 ^ (b2&0xff)<<8 ^ b3&0xff;
	}
	private static void toByteArray(int i, byte[] b, int offset) {
	    b[offset  ] = (byte)(i>>>24);
	    b[offset+1] = (byte)(i>>>16);
	    b[offset+2] = (byte)(i>>> 8);
	    b[offset+3] = (byte)(i     );
	}
	private static int ARIAm(int t) {
		return 0x00010101*((t>>>24)&0xff) ^ 0x01000101*((t>>>16)&0xff) ^ 0x01010001*((t>>>8)&0xff) ^ 0x01010100*(t&0xff);
	}
	/*
	private static final int ms(int t) {
		return TARIA_S1[(t>>>24)&0xff]^TARIA_S2[(t>>>16)&0xff]^TARIA_X1[(t>>>8)&0xff]^TARIA_X2[t&0xff];
	}
	private static final int mx(int t) {
		return TARIA_X1[(t>>>24)&0xff]^TARIA_X2[(t>>>16)&0xff]^TARIA_S1[(t>>>8)&0xff]^TARIA_S2[t&0xff];
	}
	*/
	private static final int ARIAbadc(int t) {
		return ((t<<8)&0xff00ff00) ^ ((t>>>8)&0x00ff00ff);
	}

	private static final int ARIAcdab(int t) {
		return ((t<<16)&0xffff0000) ^ ((t>>>16)&0x0000ffff);
	}

	private static final int ARIAdcba(int t) {
		return (t&0x000000ff)<<24 ^ (t&0x0000ff00)<<8 ^ (t&0x00ff0000)>>>8 ^ (t&0xff000000)>>>24;
	}

	private static final void ARIAgsrk(int[] x, int[] y, int rot, int[] rk, int offset) {
	    int q = 4-(rot/32), r = rot%32, s = 32-r;
	    rk[offset]   = x[0] ^ y[(q  )%4]>>>r ^ y[(q+3)%4]<<s;
	    rk[offset+1] = x[1] ^ y[(q+1)%4]>>>r ^ y[(q  )%4]<<s;
	    rk[offset+2] = x[2] ^ y[(q+2)%4]>>>r ^ y[(q+1)%4]<<s;
	    rk[offset+3] = x[3] ^ y[(q+3)%4]>>>r ^ y[(q+2)%4]<<s;
	}
	private static final void ARIAdiff(int[] i, int offset1, int[] o, int offset2) {
	    int t0, t1, t2, t3;
	    t0 = ARIAm(i[offset1]); t1 = ARIAm(i[offset1+1]); t2 = ARIAm(i[offset1+2]); t3 = ARIAm(i[offset1+3]);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    t1 = ARIAbadc(t1); t2 = ARIAcdab(t2); t3 = ARIAdcba(t3);
	    t1 ^= t2; t2 ^= t3; t0 ^= t1; t3 ^= t1; t2 ^= t0; t1 ^= t2;
	    o[offset2] = t0; o[offset2+1] = t1; o[offset2+2] = t2; o[offset2+3] = t3;
	}
	private static final void swapBlocks(int[] arr, int offset1, int offset2) {
	    int t;
	    for(int i = 0; i < 4; i++){
	    	t				= arr[offset1+i];
	    	arr[offset1+i]	= arr[offset2+i];
	    	arr[offset2+i]	= t;
	    }
	}
	private static final void ARIAswapAndDiffuse(int[] arr, int offset1, int offset2, int[] tmp) {
	    ARIAdiff(arr, offset1, tmp, 0);
	    ARIAdiff(arr, offset2, arr, offset1);
	    arr[offset2] = tmp[0]; arr[offset2+1] = tmp[1];
	    arr[offset2+2] = tmp[2]; arr[offset2+3] = tmp[3];
	}
	private static void ARIAbyteToHex(PrintStream out, byte b) {
	    char[] buf = {
	    	ARIA_HEX_DIGITS[(b >>> 4) & 0x0F],
	    	ARIA_HEX_DIGITS[ b        & 0x0F]
	    };
	    out.print(new String(buf));
	}
	private static final byte[] padPKCS5(byte[] in, int blockSize) {
		if(in == null){
			return null;
		}
		int offset = in.length;
		int len = blockSize - (offset % blockSize);
		byte paddingOctet = (byte) (len & 0xff);
		byte[] out = new byte[offset + len];
		System.arraycopy(in, 0, out, 0, in.length);
		for(int i = offset; i < out.length; i++){
			out[i] = paddingOctet;
		}
		return out;
	}
	private static final byte[] unpadPKCS5(byte[] in, int blockSize) {
		if(in == null){
			return null;
		}
		int len = in.length;
		byte lastByte = in[len - 1];
		int padValue = lastByte & 0xff;
		if ((padValue < 0x01) || (padValue > blockSize)) {
			return null;
		}
		int offset = len - padValue;
		for(int i = offset; i < len; i++){
			if (in[i] != padValue) {
				return null;
			}
		}
		byte[] out = new byte[offset];
		System.arraycopy(in, 0, out, 0, offset);
		return out;
	}
	/**
	 * 해쉬알고리즘으로 암호화 한다.
	 * @param strData 원문
	 * @param strAlgCase 알고리즘구분(MD5, SHA-1, SHA-256)
	 * @param strCharSet 미정의시 빈문자
	 * @throws NoSuchAlgorithmException
	 * @throws UnsupportedEncodingException
	 */
	private static String encryptHASH(String strData, String strAlgCase, String strCharSet) throws NoSuchAlgorithmException, UnsupportedEncodingException{
		//java.security.MessageDigest 객체를 이용한해쉬알고리즘을 정의한다.
		MessageDigest objMD = MessageDigest.getInstance(strAlgCase);
		//원문을 바이트 Array로 변환시켜 메시지 다이제스트 객체에 로드한다.
		if(strCharSet.equals("")){
			objMD.update(strData.getBytes());
		} else {
			objMD.update(strData.getBytes(strCharSet));
		}
		//해쉬알고리즘을 통한 메시지다이제스트 값을 추출한다.
		byte byteData[] = objMD.digest();
		//문자열로 변환한다.
		StringBuffer objStringBuffer = new StringBuffer();
		for(int i = 0 ; i < byteData.length ; i++){
			objStringBuffer.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
		}
		return objStringBuffer.toString();
	}
	/**
	 * 모든 특수문자를 제거
	 * @param strValue 특수문자가 포함된 문자열
	 * @return 특수문자가 제거된 값
	 */
	private static String replaceSpecialCharacters(String strValue) {
		return strValue.replaceAll("[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]", "");
	}
}
