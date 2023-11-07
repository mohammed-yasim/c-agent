import { infox_db, infox_datatype, infox_model, infox_sequlize } from "../db";
class Configuration extends infox_model { }
Configuration.init({

    name: { type: infox_datatype.STRING, allowNull: true },
    type: { type: infox_datatype.STRING, allowNull: true },
    key: { type: infox_datatype.STRING, allowNull: true },
    value: { type: infox_datatype.TEXT, allowNull: true },

}, { sequelize: infox_db });

export {
    Configuration
}