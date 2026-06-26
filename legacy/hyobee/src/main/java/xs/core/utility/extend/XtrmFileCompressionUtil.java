package xs.core.utility.extend;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Stack;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.compress.utils.IOUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class XtrmFileCompressionUtil {

	/**
	 * 압축파일이 존재하는 디렉토리에 압축 해제
	 * @param zippedFile
	 * @throws IOException
	 */
	public static void unzip(File zippedFile) throws IOException{
		unzip(zippedFile, Charset.defaultCharset().name());
	}

	public static void unzip(File zippedFile, String encoding ) throws IOException{
		unzip(zippedFile, zippedFile.getParentFile(), encoding);
	}

	public static void unzip(File zippedFile, File destDir) throws IOException{
		unzip(new FileInputStream(zippedFile), destDir, Charset.defaultCharset().name());
	}

	public static void unzip(File zippedFile, File destDir, String encoding) throws IOException{
		unzip(new FileInputStream(zippedFile), destDir, encoding);
	}

	public static void unzip(InputStream is, File destDir) throws IOException{
		unzip(is, destDir, Charset.defaultCharset().name());
	}

	public static void unzip(InputStream is, File destDir, String encoding) throws IOException{
		ZipArchiveInputStream zis;
		ZipArchiveEntry entry;
		String name;
		File target;
		int nWritten = 0;
		BufferedOutputStream bos;
		byte [] buf = new byte[1024 * 8];

		ensureDestDir(destDir);

		zis = new ZipArchiveInputStream(is, encoding, false);
		while((entry = zis.getNextZipEntry()) != null){
			name = entry.getName();
			target = new File(destDir, name);
			if(entry.isDirectory()){
				ensureDestDir(target);
			}else{
				target.createNewFile();
				bos = new BufferedOutputStream(new FileOutputStream(target));
				while((nWritten = zis.read(buf)) >= 0){
					bos.write(buf, 0, nWritten);
				}
				bos.close();
			}
		}
		is.close();
		zis.close();
	}

	public static void untar(File file, String destPath) throws IOException{
		BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file.getAbsolutePath()));
		TarArchiveInputStream in = null;
		TarArchiveEntry entry = null;
		if(file.getName().endsWith(".gz")) {
			GzipCompressorInputStream gzIn = new GzipCompressorInputStream(bis);
			in = new TarArchiveInputStream(gzIn);
		}else {
			in = new TarArchiveInputStream(bis);
		}
		int len = -1;
		byte[] buffer = new byte[8*1024];
		while( (entry = in.getNextTarEntry()) != null ) {
			File fd = new File(destPath + "/" + entry.getName());
			if(!entry.isDirectory()) {
				fd.getParentFile().mkdirs();
				FileOutputStream out = new FileOutputStream(fd);
				while( (len = in.read(buffer)) > 0 ) {
					out.write(buffer, 0, len);
				}
				out.flush();
				out.close();
			}
		}
		in.close();
		bis.close();
	}

	private static void ensureDestDir(File dir) throws IOException{
		if(! dir.exists()){
			dir.mkdirs(); /* does it always work? */
		}
	}

	/**
	 * compresses the given file(or dir) and creates new file under the same directory.
	 * @param src file or directory
	 * @throws IOException
	 */
	public static void zip(File src) throws IOException{
		zip(src, Charset.defaultCharset().name(), true);
	}

	/**
	 * zips the given file(or dir) and create
	 * @param src file or directory to compress
	 * @param includeSrc if true and src is directory, then src is not included in the compression. if false, src is included.
	 * @throws IOException
	 */
	public static void zip(File src, boolean includeSrc) throws IOException{
		zip(src, Charset.defaultCharset().name(), includeSrc);
	}

	/**
	 * compresses the given src file (or directory) with the given encoding
	 * @param src
	 * @param charSetName
	 * @param includeSrc
	 * @throws IOException
	 */
	public static void zip(File src, String charSetName, boolean includeSrc) throws IOException{
		zip( src, src.getParentFile(), charSetName, includeSrc);
	}

	/**
	 * compresses the given src file(or directory) and writes to the given output stream.
	 * @param src
	 * @param os
	 * @throws IOException
	 */
	public static void zip(File src, OutputStream os) throws IOException{
		zip(src, os, Charset.defaultCharset().name(), true);
	}

	/**
	 * compresses the given src file(or directory) and create the compressed file under the given destDir.
	 * @param src
	 * @param destDir
	 * @param charSetName
	 * @param includeSrc
	 * @throws IOException
	 */
	public static void zip(File src, File destDir, String charSetName, boolean includeSrc) throws IOException{
		String fileName = src.getName();
		if(!src.isDirectory()){
			int pos = fileName.lastIndexOf(".");
			if(pos > 0){
				fileName = fileName.substring(0, pos);
			}
		}
		fileName += ".zip";
		ensureDestDir(destDir);

		File zippedFile = new File(destDir, fileName);
		if(!zippedFile.exists()) {
			zippedFile.createNewFile();
		}
		zip(src, new FileOutputStream(zippedFile), charSetName, includeSrc);
	}

	public static void zip(File[] filesToZip, OutputStream os, String encoding){

	}

	public static void zip(File src, OutputStream os, String charsetName, boolean includeSrc) throws IOException{
		ZipArchiveOutputStream zos = new ZipArchiveOutputStream(os);
		zos.setEncoding(charsetName);
		FileInputStream fis;
		int length;
		ZipArchiveEntry ze;
		byte[] buf = new byte[8 * 1024];
		String name;
		Stack<File> stack = new Stack<>();
		File root;
		if(src.isDirectory()){
			if(includeSrc){
				stack.push(src);
				root = src.getParentFile();
			}else{
				File[] fs = src.listFiles();
				for(int i = 0; i < fs.length; i++){
					stack.push(fs[i]);
				}
				root = src;
			}
		}else{
			stack.push(src);
			root = src.getParentFile();
		}
		while(!stack.isEmpty()){
			File f = stack.pop();
			name = toPath(root, f);
			if(f.isDirectory()){
				File[] fs = f.listFiles();
				for(int i = 0; i < fs.length; i++){
					if(fs[i].isDirectory()){
						stack.push(fs[i]);
					} else {
						stack.add(0, fs[i]);
					}
				}
			}else{
				ze = new ZipArchiveEntry(name);
				zos.putArchiveEntry(ze);
				fis = new FileInputStream(f);
				while((length = fis.read(buf, 0, buf.length)) >= 0){
					zos.write(buf, 0, length);
				}
				fis.close();
				zos.closeArchiveEntry();
			}
		}
		zos.close();
	}

	// 리스트로 파일을 받아 zip로 압축
	@SuppressWarnings("null")
	public static void zip(List<File> src, OutputStream os) throws IOException{
		ZipArchiveOutputStream zos = new ZipArchiveOutputStream(os);
		zos.setEncoding(Charset.defaultCharset().name());
		FileInputStream fis = null;

		int length;
		ZipArchiveEntry ze;
		byte[] buf = new byte[8 * 1024];

		if(src.size() > 0){
			for(int i = 0; i < src.size(); i++){
				log.info("name: " + src.get(i).getName());
				ze = new ZipArchiveEntry(src.get(i).getName());
				zos.putArchiveEntry(ze); fis = new FileInputStream(src.get(i));
				while((length = fis.read(buf, 0, buf.length)) >= 0){
					zos.write(buf, 0, length);
				}
			}
			fis.close();
			zos.closeArchiveEntry();
		}
		zos.close();
	}

	// 파일 배열로 파일을 받아 zip로 압축
	@SuppressWarnings("null")
	public static void zip(File[] src, OutputStream os) throws IOException{
		ZipArchiveOutputStream zos = new ZipArchiveOutputStream(os);
		zos.setEncoding(Charset.defaultCharset().name());
		FileInputStream fis = null;

		int length;
		ZipArchiveEntry ze;
		byte[] buf = new byte[8 * 1024];

		if(src.length > 0){
			for(int i = 0; i < src.length; i++){
				ze = new ZipArchiveEntry(src[i].getName());
				zos.putArchiveEntry(ze); fis = new FileInputStream(src[i]);
				while((length = fis.read(buf, 0, buf.length)) >= 0){
					zos.write(buf, 0, length);
				}
			}
			fis.close();
			zos.closeArchiveEntry();
		}
		zos.close();
	}

	public static void tar(String parentDir, String[] inputFiles, String outputFile) throws IOException{
		TarArchiveOutputStream out = null;
		BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(parentDir, outputFile)));
		GzipCompressorOutputStream gzOut = new GzipCompressorOutputStream(bos);
		out = new TarArchiveOutputStream(gzOut);

		for (int i = 0; i < inputFiles.length; i++) {
			File f = new File(parentDir, inputFiles[i]);
			TarArchiveEntry tarEntry = new TarArchiveEntry(f, f.getName());
			out.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
			out.putArchiveEntry(tarEntry);
			FileInputStream input = new FileInputStream(f);
			try {
				IOUtils.copy(input, out);
			} finally {
				input.close();
			}
			out.closeArchiveEntry();
		}
		out.finish();
		out.close();
		out = null;
	}

	public static void tar(String parentDir, List<String> inputFiles, String outputFile) throws IOException{
		TarArchiveOutputStream out = null;
		BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(parentDir, outputFile)));
		GzipCompressorOutputStream gzOut = new GzipCompressorOutputStream(bos);
		out = new TarArchiveOutputStream(gzOut);

		for (int i = 0; i < inputFiles.size(); i++) {
			File f = new File(parentDir, inputFiles.get(i));
			TarArchiveEntry tarEntry = new TarArchiveEntry(f, f.getName());
			out.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
			out.putArchiveEntry(tarEntry);
			FileInputStream input = new FileInputStream(f);
			try {
				IOUtils.copy(input, out);
			} finally {
				input.close();
			}
			out.closeArchiveEntry();
		}
		out.finish();
		out.close();
		out = null;
	}

	private static String toPath(File root, File dir){
		String path = dir.getAbsolutePath();
		path = path.substring(root.getAbsolutePath().length()).replace(File.separatorChar, '/');
		if(path.startsWith("/")) {
			path = path.substring(1);
		}
		if(dir.isDirectory() && !path.endsWith("/")){
			path += "/";
		}
		return path ;
	}
}
