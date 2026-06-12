package xs.core.handler.mybatis;

import java.sql.CallableStatement;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.GregorianCalendar;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

public class XtrmDateTypeHandler extends BaseTypeHandler<Date> {

	@Override
	public Date getNullableResult(ResultSet rs, String columnName) throws SQLException {
		Timestamp ts = rs.getTimestamp(columnName);
		if (ts != null) {
			return new Date(ts.getTime());
		}
		return null;
	}

	@Override
	public Date getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		Timestamp ts = rs.getTimestamp(columnIndex);
		if (ts != null) {
			return new Date(ts.getTime());
		}
		return null;
	}

	@Override
	public Date getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		Timestamp ts = cs.getTimestamp(columnIndex);
		if (ts != null) {
			return new Date(ts.getTime());
		}
		return null;
	}

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, Date parameter, JdbcType jdbctype)
			throws SQLException {
		ps.setDate(i, parameter,
				GregorianCalendar.from(ZonedDateTime.ofInstant(parameter.toInstant(), ZoneId.systemDefault())));
	}

}
