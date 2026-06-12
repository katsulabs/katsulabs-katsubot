package xs.core.dto;

import java.util.List;

import org.apache.ibatis.session.ResultHandler;

import xs.core.database.XtrmDAO;

/**
 * DAO helpers for {@link ApiEnvelope} (TB-005e-3+).
 */
public final class ApiEnvelopes {

	private ApiEnvelopes() {
	}

	public static ApiEnvelope selectJson(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params)
			throws Exception {
		return dao.selectJson(namespace, sqlId, params);
	}

	public static int update(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.update(namespace, sqlId, params);
	}

	public static int insert(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.insert(namespace, sqlId, params);
	}

	public static int delete(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.delete(namespace, sqlId, params);
	}

	public static int updateList(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.updateList(namespace, sqlId, params);
	}

	public static int insertList(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.insertList(namespace, sqlId, params);
	}

	public static int deleteList(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params) throws Exception {
		return dao.deleteList(namespace, sqlId, params);
	}

	public static ApiEnvelope copyOf(ApiEnvelope source) {
		if (source == null) {
			return new ApiEnvelope();
		}
		ApiEnvelope copy = new ApiEnvelope();
		copy.setRoot(source.getRoot().deepCopy());
		return copy;
	}

	public static ApiEnvelope selectJson(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params,
			String poolName, ResultHandler<?> handler) throws Exception {
		return dao.selectJson(namespace, sqlId, params, poolName, handler);
	}

	public static <T> List<T> selectMap(XtrmDAO dao, String namespace, String sqlId, ApiEnvelope params,
			Class<T> type) throws Exception {
		return dao.selectMap(namespace, sqlId, params, type);
	}
}
