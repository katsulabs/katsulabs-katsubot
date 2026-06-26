package xs.core.handler.mybatis;

import java.util.List;
import java.util.Map;

@SuppressWarnings("rawtypes")
public class XtrmParamCheckHandler {

	public static Boolean isEmpty(Object objValue) {
		boolean isEmpty = false;
		if (objValue == null) {
			isEmpty = true;
		} else {
			if (objValue instanceof String) {
				isEmpty = "".equals(objValue.toString());
			} else if (objValue instanceof Map) {
				isEmpty = ((Map) objValue).isEmpty();
			} else if (objValue instanceof List) {
				isEmpty = ((List) objValue).isEmpty();
			}
		}
		return isEmpty;
	}

	// 20221202 Insert,Update 시 null을 set하기 위해 isNullable 인자를 가진 isEmpty 오버로딩
	public static Boolean isEmpty(Object objValue, boolean isNullable) {
		boolean isEmpty = false;
		if (objValue == null) {
			if (!isNullable) {
				isEmpty = true;
			}
		} else {
			if (objValue instanceof String) {
				isEmpty = "".equals(objValue.toString());
			} else if (objValue instanceof Map) {
				isEmpty = ((Map) objValue).isEmpty();
			} else if (objValue instanceof List) {
				isEmpty = ((List) objValue).isEmpty();
			}
		}
		return isEmpty;
	}

	public static Boolean notEmpty(Object objValue) {
		return !isEmpty(objValue);
	}

	public static Boolean notEmpty(Object objValue, boolean isNullable) {
		return !isEmpty(objValue, isNullable);
	}

}
