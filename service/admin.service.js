var models = require("../models/index.js");

//관리자 리스트
exports.list = async ( body ) => {
  var query = `
      select
        admin_seq,
        admin_id,
        name
      from
        admin
      where
        show_yn = 'Y' and
        delete_yn = 'N'
  `;
  var subscribeData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return subscribeData;
};

//관리자 상세
exports.read = async ( body ) => {
  var query = `
      select
        admin_seq,
        admin_id,
        name
      from
        admin
      where
        admin_seq = ${body.admin_seq}
  `;
  var subscribeData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });
  console.log(subscribeData)
  return subscribeData;
};


//관리자 추가
exports.create = async ( body ) => {
  var query = `
      insert into admin(admin_id, password, name)
      values('${body.admin_id}', password('${body.password}'), '${body.name}','')
  `;
  var subscribeData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  }).catch(err => {
    console.log("=========================================================")
    console.log(err.original.sqlMessage);
    console.log("=========================================================")
  });
  return subscribeData;
};

//관리자 수정
exports.update = async ( body ) => {
  var query = `
      update
        admin
      set
        name = '${body.name}'
      where
        admin_seq = ${body.admin_seq}
  `;
  var subscribeData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });
  return subscribeData;
};

//관리자 삭제
exports.delete = async ( body ) => {
  var query = `
      update
        admin
      set
        delete_yn = 'Y'
      where
        admin_seq = ${body.admin_seq}
  `;
  var subscribeData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });
  return subscribeData;
};
