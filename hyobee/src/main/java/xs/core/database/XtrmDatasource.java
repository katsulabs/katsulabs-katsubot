package xs.core.database;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.support.TransactionTemplate;

public class XtrmDatasource {

	@Autowired
	@Qualifier("xtrmdbSqlSession")
	protected SqlSession xtrmdbSqlSession;

//	@Autowired
//	@Qualifier("xtrmdwSqlSession")
//	protected SqlSession xtrmdwSqlSession;

	@Autowired
	@Qualifier("xtrmdbTx")
	protected TransactionTemplate xtrmdbTx;

//	@Autowired
//	@Qualifier("xtrmdwTx")
//	protected TransactionTemplate xtrmdwTx;

}