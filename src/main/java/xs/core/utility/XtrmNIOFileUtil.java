package xs.core.utility;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.channels.CompletionHandler;
import java.nio.channels.FileChannel;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.util.FileSystemUtils;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.extend.XtrmFileCompressionUtil;
import xs.core.utility.extend.XtrmFileExplorer;

@SuppressWarnings({ "rawtypes", "unchecked" })
@Slf4j
public class XtrmNIOFileUtil extends XtrmFileCompressionUtil {

	/**
	 * 중복성과 보안을 고려한 안전파일명을 반환한다.
	 * @return 생성된 안전파일명
	 */
	public static String getSafetyFileName(){
		return UUID.randomUUID().toString();
	}

	/**
	 * 해당 파일이 및 폴더가 존재하는 체크
	 * @param strFilePath 파일경로 전체정보(파일명포함)
	 * @return true:파일이 존재, false:파일이 없음
	 * @throws Exception
	 */
	public static boolean existFile(String strFilePath) throws Exception {
		return Files.exists(Paths.get(strFilePath));
	}

	public static boolean existFile(File objFile) throws Exception {
		return existFile(objFile.getPath());
	}

	/**
	 * 해당 파일 쓰기중 여부 판단
	 * @param strFilePath 파일경로 전체정보(파일명포함)
	 * @return true:쓰기완료, false:쓰기중
	 * @throws Exception
	 */
	public static boolean isFileWritable(String strFilePath) throws Exception {
		boolean blnReturnValue			= false;
		if(existFile(strFilePath)){
			Path objPath				= Paths.get(strFilePath);
			FileChannel objFileChannel	= null;
			try{
				if(objFileChannel == null || !objFileChannel.isOpen()){objFileChannel = FileChannel.open(objPath, StandardOpenOption.WRITE);}
				blnReturnValue			= true;
			}catch(Exception e){
			}finally{
				if(objFileChannel != null && objFileChannel.isOpen()){
					objFileChannel.close();
				}
			}
		}
		return blnReturnValue;
	}

	public static boolean isFileWritable(File objFile) throws Exception {
		return isFileWritable(objFile.getPath());
	}

	/**
	 * 전체 경로를 이용하여 디렉토리를 생성한다.
	 * @param strPath 생성한 디렉토리의 전체 경로
	 * @throws Exception
	 */
	public static void createDirectory(String strPath) throws Exception {
		Files.createDirectories(Paths.get(strPath));
	}

	public static void createDirectory(File objDirectory) throws Exception {
		createDirectory(objDirectory.getPath());
	}

	/**
	 * 디렉토리 삭제
	 * @param strPath 삭제할 디렉토리 위치
	 * @param blnRecursive 하위 디렉토리 모두 삭제여부
	 * @throws Exception
	 */
	public static void deleteDirectory(String strPath, boolean blnRecursive) throws Exception {
		Path objPath = Paths.get(strPath);
		if(Files.exists(objPath) && Files.isDirectory(objPath)){
			if(blnRecursive){
				FileSystemUtils.deleteRecursively(objPath.toFile());
			}else{
				Files.walk(objPath, 1).sorted(Comparator.reverseOrder()).forEach(path -> {
					if(Files.isRegularFile(path)){
						try{
							Files.deleteIfExists(path);
						}catch (IOException e){}
					}
				});
			}
		}
	}

	public static void deleteDirectory(File objDirectory, boolean blnRecursive) throws Exception {
		deleteDirectory(objDirectory.getPath(), blnRecursive);
	}

	/**
	 * 파일을 Move 한다.
	 * @param strSrcPath 잘라내기 할 파일경로 전체정보(파일명포함)
	 * @param strDestPath 옮겨질 위치의 폴더경로 전체정보
	 * @throws Exception
	 */
	public static void moveFile(String strSrcPath, String strDestPath) throws Exception {
		Path objSrcPath		= Paths.get(strSrcPath);
		Path objDestPath	= Paths.get(strDestPath);
		if(Files.exists(objSrcPath) && Files.isRegularFile(objSrcPath)){
			Files.createDirectories(objDestPath);
			Files.move(objSrcPath, objDestPath, StandardCopyOption.REPLACE_EXISTING);
		}
	}

	public static void moveFile(File objSrcFile, File objDestFile) throws Exception {
		moveFile(objSrcFile.getPath(), objDestFile.getPath());
	}

	/**
	 * 파일을 복사한다.
	 * @param strSrcPath 복사할 파일경로 전체정보(파일명포함)
	 * @param strDestPath 복사될 위치의 폴더경로 전체정보
	 * @throws Exception
	 */
	public static void copyFile(String strSrcPath, String strDestPath) throws Exception {
		Path objSrcPath		= Paths.get(strSrcPath);
		Path objDestPath	= Paths.get(strDestPath);
		if(Files.exists(objSrcPath) && Files.isRegularFile(objSrcPath)){
			Files.createDirectories(objDestPath);
			Files.copy(objSrcPath, objDestPath, StandardCopyOption.REPLACE_EXISTING);
		}
	}

	public static void copyFile(File objSrcFile, File objDestFile) throws Exception {
		copyFile(objSrcFile.getPath(), objDestFile.getPath());
	}

	/**
	 * 파일을 삭제한다.
	 * @param strFilePath 삭제할 파일경로 전체정보(파일명포함)
	 * @throws Exception
	 */
	public static boolean deleteFile(String strFilePath) throws Exception {
		boolean blnReturnValue	= true;
		if(existFile(strFilePath)){
			Path objPath = Paths.get(strFilePath);
			if(Files.isRegularFile(objPath)){
				blnReturnValue	= Files.deleteIfExists(objPath);
			}
		}
		return blnReturnValue;
	}

	public static boolean deleteFile(File objFile) throws Exception {
		return deleteFile(objFile.getPath());
	}

	/**
	 * 파일정보를 조회한다
	 * @param strFilePath 조회할 파일경로 전체정보(파일명포함)
	 * @throws Exception
	 */
	public static ApiEnvelope getFileInfo(String strFilePath) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		objXtrmReturn.setResultHeader(false);
		if(existFile(strFilePath)){
			ApiEnvelope objXtrmChildFiles = getFileTreeData(strFilePath, true);
			ArrayNode objFileDataArray	= objXtrmChildFiles.getDataArrayNode();
			objXtrmReturn.setHeader("COUNT", 1);
			objXtrmReturn.setDataObjectNode((ObjectNode) objFileDataArray.get(0));
			if(objFileDataArray.size() > 1){
				ArrayNode childFiles = objFileDataArray.deepCopy();
				childFiles.remove(0);
				objXtrmReturn.setDataArrayNode(childFiles, "CHILD_FILES");
				objXtrmReturn.setHeader("COUNT", childFiles.size());
			}
		}else{
			objXtrmReturn.setResultHeader(true, "File Not Exist");
			objXtrmReturn.setHeader("COUNT", 0);
		}
		return objXtrmReturn;
	}

	public static ApiEnvelope getFileInfo(File objFile) throws Exception {
		return getFileInfo(objFile.getPath());
	}

	/**
	 * 확장자를 제외한 파일명 정보 반환
	 * @param strFilePath 조회할 파일경로 전체정보(파일명포함)
	 * @throws Exception
	 */
	public static String getFileNameExceptExtension(String strFilePath) throws Exception {
		String strFileName		= new String();
		ApiEnvelope objFileInfo	= getFileInfo(strFilePath);
		if(!objFileInfo.getErrorFlag()){
			strFileName			= objFileInfo.getString("fileName").replaceAll("." + objFileInfo.getString("fileExtension"), "");
		}
		return strFileName;
	}

	public static String getFileNameExceptExtension(File objFile) throws Exception {
		return getFileNameExceptExtension(objFile.getPath());
	}

	/**
	 * 파일 확장자명 반환
	 * @param strFilePath 조회할 파일경로 전체정보(파일명포함)
	 * @throws Exception
	 */
	public static String getFileExtensionName(String strFilePath) throws Exception {
		String strFileExtensionName		= new String();
		ApiEnvelope objFileInfo		= getFileInfo(strFilePath);
		if(!objFileInfo.getErrorFlag()){
			strFileExtensionName		= objFileInfo.getString("fileExtension");
		}
		return strFileExtensionName;
	}

	public static String getFileExtensionName(File objFile) throws Exception {
		return getFileExtensionName(objFile.getPath());
	}

	/**
	 * 파일byte사이즈를 Human Readable 사이즈로 반환
	 * @param longFileSize 파일byte사이즈
	 * @param blnSi	계산단위 true:1000, false:1024
	 */
	public static String getFileSizeHuman(String strFilePath, boolean blnSi) throws Exception {
		String strReturnValue	= new String();
		if(existFile(strFilePath)){
			Path objPath		= Paths.get(strFilePath);
			long longFileSize	= objPath.toFile().length();
			strReturnValue		= convertFileSizeHumanReadable(longFileSize, blnSi);
		}
		return strReturnValue;
	}
	public static String getFileSizeHuman(File objFile, boolean blnSi) throws Exception {
		return getFileSizeHuman(objFile.getPath(), blnSi);
	}
	public static String getFileSizeHuman(String strFilePath) throws Exception {
		return getFileSizeHuman(strFilePath, false);
	}
	public static String getFileSizeHuman(File objFile) throws Exception {
		return getFileSizeHuman(objFile.getPath(), false);
	}

	/**
	 * 재귀호출에 의한 시작경로부터의 모든 디렉토리 및 파일정보를 트리형태 데이터로 반환한다.
	 * @param strStartDirPath 파일의 전체경로
	 * @return
	 * @throws Exception
	 */
	public static ApiEnvelope getFileTreeData(String strStartDirPath, List<String> objValidFileExtensionList, boolean blnOnlyChild) throws Exception{
		XtrmFileExplorer objFileExplorer = new XtrmFileExplorer();
		return objFileExplorer.fileVisitor(strStartDirPath, objValidFileExtensionList, blnOnlyChild);
	}
	public static ApiEnvelope getFileTreeData(String strStartDirPath, List<String> objValidFileExtensionList) throws Exception{
		return getFileTreeData(strStartDirPath, objValidFileExtensionList, false);
	}
	public static ApiEnvelope getFileTreeData(String strStartDirPath, boolean blnOnlyChild) throws Exception{
		List<String> objValidFileExtensionList = new ArrayList<>();
		objValidFileExtensionList.add("*");
		return getFileTreeData(strStartDirPath, objValidFileExtensionList, blnOnlyChild);
	}
	public static ApiEnvelope getFileTreeData(String strStartDirPath) throws Exception{
		List<String> objValidFileExtensionList = new ArrayList<>();
		objValidFileExtensionList.add("*");
		return getFileTreeData(strStartDirPath, objValidFileExtensionList, false);
	}

	/**
	 * 파일읽기
	 * @param strFileFullPath 파일의 전체경로
	 * @return 파일내용
	 * @throws Exception
	 */
	public static byte[] readFile(String strFileFullPath) throws Exception{
		//반환객체 생성
		byte[] objFileByte	= null;
		//파일정보 추출
		Path path			= Paths.get(strFileFullPath);
		//파일 존재여부 및 읽기 가능여부 체크
		if(Files.exists(path) && Files.isReadable(path)){
			objFileByte		= Files.readAllBytes(path);
		}
		return objFileByte;
	}
	public static byte[] readFile(File objSrcFile) throws Exception{
		return readFile(objSrcFile.getPath());
	}

	/**
	 * 파일읽기(줄단위)
	 * @param strFileFullPath 파일의 전체경로
	 * @return 파일내용
	 * @throws Exception
	 */
	public static List<String> readAllLines(String strFileFullPath) throws Exception{
		//반환객체 생성
		List<String> allLines	= new ArrayList<>();
		//파일정보 추출
		Path path				= Paths.get(strFileFullPath);
		//파일 존재여부 및 읽기 가능여부 체크
		if(Files.exists(path) && Files.isReadable(path)){
			try{
				allLines		= Files.readAllLines(path, StandardCharsets.UTF_8);
			}catch(MalformedInputException e){
				allLines		= Arrays.asList(new String(readFile(strFileFullPath), "UTF-8").replaceAll("\r|\n|\r|\r\n|\n\r", "\\|\\|").split("\\|\\|"));
			}
		}
		return allLines;
	}
	public static List<String> readAllLines(File objSrcFile) throws Exception{
		return readAllLines(objSrcFile.getPath());
	}

	/**
	 * 파일쓰기
	 * @param strFileFullPath 파일의 전체경로
	 * @param objWriteData 쓰기내용
	 * @param blnCreate 파일이 존재하지 않는경우 새롭게 생성할지 여부
	 * @param blnAppend 파일에 내용이 존재하는 경우 append여부 false라면 덮어쓰기
	 * @param blnAsync 비동기 처리 여부
	 * @throws Exception
	 */
	public static void writeFile(String strFileFullPath, byte[] objWriteData, boolean blnCreate, boolean blnAppend, boolean blnAsync) throws Exception{
		//파일정보 추출
		Path path = Paths.get(strFileFullPath);
		//파일 존재여부
		boolean blnExistFile = Files.exists(path);
		//파일 존재여부 체크 및 blnCreate 옵션이 false인 경우 처리하지 않음
		if(!blnCreate && !blnExistFile){return;}
		//파일에 쓰기권한이 존재하지 않는경우 처리하지 않음
		if(blnExistFile && !Files.isWritable(path)){return;}
		//비동기 처리여부에 따른 분기처리
		if(!blnAsync){
			FileChannel fileChannel	= null;
			try{
				if(blnExistFile){
					if(blnAppend){
						fileChannel = FileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.APPEND);
					}else{
						fileChannel = FileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
					}
				}else{
					if(!Files.exists(Paths.get(path.getParent().toString()))){
						Files.createDirectories(path.getParent());
					}
					fileChannel = FileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.CREATE);
				}
				fileChannel.write(ByteBuffer.wrap(objWriteData));
				fileChannel.close();
			}catch(Exception ex01){
				log.error("NETWORK_INTERFACE_ERROR", ex01);
			}finally{
				if(fileChannel != null && fileChannel.isOpen()){
					fileChannel.close();
				}
			}
		}else{
			ByteBuffer objByteBuffer = null;
			if(objWriteData.length < 1024 * 10){
				objByteBuffer = ByteBuffer.wrap(objWriteData);
			}else{
				objByteBuffer = ByteBuffer.allocate(1024 * 10);
				for(int i = 0; i < 1024 * 10; i++){
					objByteBuffer.put(objWriteData[i]);
				}
			}
			objByteBuffer.flip();
			AsynchronousFileChannel asyncFileChannel;
			if(blnExistFile){
				if(blnAppend){
					asyncFileChannel = AsynchronousFileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.APPEND);
				}else{
					asyncFileChannel = AsynchronousFileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
				}
			}else{
				if(!Files.exists(Paths.get(path.getParent().toString()))){
					Files.createDirectories(path.getParent());
				}
				asyncFileChannel = AsynchronousFileChannel.open(path, StandardOpenOption.WRITE, StandardOpenOption.CREATE);
			}
			HashMap<String, Object> objAttach = new HashMap<>();
			objAttach.put("CURRENT_ITERATION"		,0);
			objAttach.put("CURRENT_WRITE_BYTE"		,0);
			objAttach.put("TOTAL_BYTE_LENGTH"		,objWriteData.length);
			objAttach.put("WRITE_DATA_BYTE_ARRAY"	,objWriteData);
			objAttach.put("FILE_CHANNEL_OBJECT"		,asyncFileChannel);
			CompletionHandler objHandler = new CompletionHandler<Integer, HashMap<String, Object>>(){
				@Override
				public void completed(Integer result, HashMap<String, Object> objAttach){
					AsynchronousFileChannel objChannel	= (AsynchronousFileChannel)objAttach.get("FILE_CHANNEL_OBJECT");
					if(result > -1){
						int intTotalByteLength			= (Integer)objAttach.get("TOTAL_BYTE_LENGTH");
						int intCurrentIndex				= (Integer)objAttach.get("CURRENT_WRITE_BYTE");
						int intLastIndex				= 0;
						byte[] objWriteByteArray		= (byte[])objAttach.get("WRITE_DATA_BYTE_ARRAY");
						ByteBuffer objBuffer			= null;
						intCurrentIndex					= intCurrentIndex + result;
						intLastIndex					= intCurrentIndex + (1024 * 10);
						objAttach.put("CURRENT_WRITE_BYTE", intCurrentIndex);
						if(intTotalByteLength > intCurrentIndex){
							if(intLastIndex > intTotalByteLength){intLastIndex = intTotalByteLength;}
							objBuffer = ByteBuffer.allocate(intLastIndex - intCurrentIndex);
							for(int i = intCurrentIndex; i < intLastIndex; i++){
								objBuffer.put(objWriteByteArray[i]);
							}
							objBuffer.flip();
							objChannel.write(objBuffer, intCurrentIndex, objAttach, this);
						}else{
							objAttach = null;
							try{objChannel.close();}catch(IOException e){}
						}
					}else{
						objAttach = null;
						try{objChannel.close();}catch(IOException e){}
					}
				}
				@Override
				public void failed(Throwable objException, HashMap<String, Object> objAttach){
					AsynchronousFileChannel objChannel = (AsynchronousFileChannel)objAttach.get("FILE_CHANNEL_OBJECT");
					objAttach = null;
					try{objChannel.close();}catch(IOException e){}
				}
			};
			asyncFileChannel.write(objByteBuffer, 0, objAttach, objHandler);
		}
	}
	public static void writeFile(String strFileFullPath, byte[] objWriteData, boolean blnCreate, boolean blnAppend) throws Exception{
		writeFile(strFileFullPath, objWriteData, blnCreate, blnAppend, false);
	}
	public static void writeFile(String strFileFullPath, byte[] objWriteData, boolean blnCreate) throws Exception{
		writeFile(strFileFullPath, objWriteData, blnCreate, false, false);
	}
	public static void writeFile(String strFileFullPath, byte[] objWriteData) throws Exception{
		writeFile(strFileFullPath, objWriteData, true, false, false);
	}

	private static String convertFileSizeHumanReadable(long longFileSize, boolean blnSi) {
		String strReturnValue	= new String();
		int intPower			= blnSi ? 1000 : 1024;
		if(longFileSize < intPower){
			strReturnValue		= String.valueOf(longFileSize) + "B";
		}else{
			int intExp			= (int)(Math.log(longFileSize) / Math.log(intPower));
			String strPre		= "KMGTPEZY".charAt(intExp-1) + "";
			strReturnValue		= String.format("%.2f %sB", longFileSize / Math.pow(intPower, intExp), strPre);
		}
		return strReturnValue;
	}
}

