import { infox_db, infox_datatype, infox_model, infox_sequlize } from "./etc/db";
class Configuration extends infox_model { }
Configuration.init({

    name: { type: infox_datatype.STRING, allowNull: true },
    type: { type: infox_datatype.STRING, allowNull: true },
    key: { type: infox_datatype.STRING, allowNull: true },
    value: { type: infox_datatype.TEXT, allowNull: true },

}, { sequelize: infox_db });


class User extends infox_model { }
User.init({}, { sequelize: infox_db });

class ServiceArea extends infox_model { }
ServiceArea.init({}, { sequelize: infox_db });
class DayBook extends infox_model { }
DayBook.init({}, { sequelize: infox_db });

class Customer extends infox_model { }
class Invoice extends infox_model { }
class Receipt extends infox_model { }
class Activity extends infox_model { }


Customer.init({}, { sequelize: infox_db });
Invoice.init({}, { sequelize: infox_db });
Receipt.init({}, { sequelize: infox_db });
Activity.init({}, { sequelize: infox_db });

ServiceArea.hasMany(User);
ServiceArea.hasMany(Customer);
ServiceArea.hasMany(Invoice);
ServiceArea.hasMany(DayBook);

Customer.hasMany(Invoice);
Customer.hasMany(Receipt);
Customer.hasMany(Activity); 

export {
    Configuration
}