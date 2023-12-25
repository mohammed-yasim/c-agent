import { infox_db, infox_datatype, infox_model, infox_sequlize } from "./etc/db";
class Configuration extends infox_model { }
Configuration.init({

    name: { type: infox_datatype.STRING, allowNull: true },
    type: { type: infox_datatype.STRING, allowNull: true },
    key: { type: infox_datatype.STRING, allowNull: true },
    value: { type: infox_datatype.TEXT, allowNull: true },

}, { sequelize: infox_db, tableName: 'configurations' });


class User extends infox_model { }

User.init({
    u_id: { primaryKey: true, type: infox_sequlize.UUID, defaultValue: infox_datatype.UUIDV4, allowNull: false },
    //----
    email: { type: infox_datatype.STRING, allowNull: false },
    passwd: { type: infox_datatype.STRING, allowNull: false },
    //----
    u_name: { type: infox_datatype.STRING, allowNull: false },
    u_mob: { type: infox_datatype.STRING, allowNull: false },
    u_profile: { type: infox_datatype.JSON, allowNull: true },
    //----
    active: { type: infox_datatype.INTEGER, defaultValue: 1, allowNull: false },
    suspended: { type: infox_datatype.INTEGER, defaultValue: 0, allowNull: false },

}, { sequelize: infox_db, tableName: 'users' });

class ServiceArea extends infox_model { }

ServiceArea.init({
    s_id: { primaryKey: true, type: infox_sequlize.UUID, defaultValue: infox_datatype.UUIDV4, allowNull: false },

    name: { type: infox_datatype.STRING, allowNull: false },
    code: { type: infox_datatype.STRING, allowNull: false },

    place: { type: infox_datatype.STRING, allowNull: false },
    lat: { type: infox_datatype.STRING, allowNull: false },
    lng: { type: infox_datatype.STRING, allowNull: false },

    contact_no: { type: infox_datatype.STRING, allowNull: false },
    contact_name: { type: infox_datatype.STRING, allowNull: false },

}, { sequelize: infox_db, tableName: 'service_areas' });

class Daybook extends infox_model { }

Daybook.init({
    referenceNumber: { type: infox_datatype.STRING },
    date: { type: infox_datatype.DATEONLY, allowNull: false },
    description: { type: infox_datatype.STRING, allowNull: true },
    debitAmount: { type: infox_datatype.DECIMAL(10, 2), allowNull: false },
    creditAmount: { type: infox_datatype.DECIMAL(10, 2), allowNull: false },
    accountName: { type: infox_datatype.STRING, allowNull: true },
    notes: { type: infox_datatype.TEXT, allowNull: true },

}, { sequelize: infox_db, tableName: 'daybooks' });

class Customer extends infox_model { }

class Invoice extends infox_model { }

class Receipt extends infox_model { }

class Activity extends infox_model { }

Customer.init({

    c_id: { primaryKey: true, type: infox_sequlize.UUID, defaultValue: infox_sequlize.UUIDV4, allowNull: false },
    // reg_no: { type: infox_datatype.STRING, allowNull: false },
    name: { type: infox_datatype.STRING, allowNull: false },
    address: { type: infox_datatype.TEXT, allowNull: false },
    contact_no: { type: infox_datatype.STRING, allowNull: false },
    whatsapp_no: { type: infox_datatype.STRING, allowNull: false },
    qr_code: { type: infox_datatype.TEXT, allowNull: true },
    //--
    geo_location: { type: infox_datatype.TEXT, allowNull: true },
    //--
    email: { type: infox_datatype.STRING, allowNull: false, defaultValue: "**##**##" },
    mobile: { type: infox_datatype.STRING, allowNull: false, defaultValue: "**##**##" },
    password: { type: infox_datatype.STRING, allowNull: false, defaultValue: "**##**##" },
    //--
    active: { type: infox_datatype.INTEGER, defaultValue: 1, allowNull: false },
    suspended: { type: infox_datatype.INTEGER, defaultValue: 0, allowNull: false },

}, { sequelize: infox_db, tableName: 'customers' });
Invoice.init({
    i_id: { primaryKey: true, type: infox_sequlize.UUID, defaultValue: infox_datatype.UUIDV4, allowNull: false },
    //-
    _no: { type: infox_datatype.STRING, allowNull: true },
    _type: { type: infox_datatype.STRING, allowNull: false },
    _desc: { type: infox_datatype.TEXT, allowNull: false },
    //-
    amount: { type: infox_datatype.DECIMAL, allowNull: false },
    date: { type: infox_datatype.DATEONLY, allowNull: false },
    //--
    deleted: { type: infox_datatype.INTEGER, defaultValue: 0, allowNull: false },
    //--
    data: { type: infox_datatype.JSON, allowNull: true }

}, { sequelize: infox_db, tableName: 'invoices' });



Receipt.init({
    r_id: { primaryKey: true, type: infox_sequlize.UUID, defaultValue: infox_datatype.UUIDV4, allowNull: false },

    _no: { type: infox_datatype.STRING, allowNull: true },
    _type: { type: infox_datatype.STRING, allowNull: false },
    _desc: { type: infox_datatype.TEXT, allowNull: false },
    //-
    amount: { type: infox_datatype.DECIMAL, allowNull: false },
    date: { type: infox_datatype.DATEONLY, allowNull: false },
    //--
    deleted: { type: infox_datatype.INTEGER, defaultValue: 0, allowNull: false },
    //
    data: { type: infox_datatype.JSON, allowNull: true }
}, { sequelize: infox_db, tableName: 'receipts' });
Activity.init({
    _type: { type: infox_datatype.STRING, allowNull: false },
    _desc: { type: infox_datatype.TEXT, allowNull: false },
    //--
    deleted: { type: infox_datatype.INTEGER, defaultValue: 0, allowNull: false },
}, { sequelize: infox_db, tableName: 'activities' });


User.hasMany(ServiceArea, { foreignKey: { name: '_owner_uid', allowNull: false }, as: 'serviceareas' });
User.hasMany(User, { foreignKey: { name: '_owner_uid', allowNull: true }, as: 'agents' });


ServiceArea.hasMany(Customer, { foreignKey: { name: '_sid', allowNull: false }, as: 'customers' });

Customer.hasMany(Invoice, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer_invoices' });
Customer.hasMany(Receipt, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer_receipts' });
Customer.hasMany(Activity, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer_activities' });

Invoice.belongsTo(Customer, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer' });
Receipt.belongsTo(Customer, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer' });
Activity.belongsTo(Customer, { foreignKey: { name: '_cid', allowNull: false }, as: 'customer' });

ServiceArea.hasMany(Daybook, { foreignKey: { name: '_sid', allowNull: false }, as: 'service_day_book' })
ServiceArea.hasMany(Invoice, { foreignKey: { name: '_sid', allowNull: false }, as: 'service_invoices' })
ServiceArea.hasMany(Receipt, { foreignKey: { name: '_sid', allowNull: false }, as: 'service_receipts' })
ServiceArea.hasMany(Activity, { foreignKey: { name: '_sid', allowNull: false }, as: 'service_activities' })

Invoice.belongsTo(Receipt, { foreignKey: { name: '_rid', allowNull: true }, as: 'receipt' });
Receipt.belongsTo(Invoice, { foreignKey: { name: '_iid', allowNull: true }, as: 'invoice' });


Daybook.belongsTo(User, { foreignKey: { name: '_uid', allowNull: false }, as: 'day_book' });
Invoice.belongsTo(User, { foreignKey: { name: '_uid', allowNull: false }, as: 'invoices' });
Receipt.belongsTo(User, { foreignKey: { name: '_uid', allowNull: false }, as: 'receipts' });
Activity.belongsTo(User, { foreignKey: { name: '_uid', allowNull: false }, as: 'activities' });

User.belongsToMany(ServiceArea, { through: 'UserServiceArea' });
ServiceArea.belongsToMany(User, { through: 'UserServiceArea' });

export {
    Configuration,
    User,
    ServiceArea,
    Daybook,
    Customer, Invoice, Receipt, Activity,
}