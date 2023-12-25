import express from 'express';
import path from 'path'
import cors from 'cors';
import { infox_db } from './app_api/etc/db';
import { Configuration, Customer, DayBook, Invoice, Receipt, ServiceArea, User } from './app_api/model';
import API from './app_api';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
const app = express();
app.use(cors());
app.use(express.json());

// app.get('/', (request, response) => {
//     let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
//     response.redirect(`/app?ip=${encodeURI(ip)}`);
// });
app.use('/api', API);
app.get('/sync', (req, res) => {
    infox_db.sync({ force: false }).then((data) => {
        res.send('Synced');
    }, (err) => {
        res.send(`${err}`);
    });
});
app.get('/test', (req, res) => {
    Configuration.findAll({ where: { q: 'e' } }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).send(`${err}`);
    });
});


app.get('/mock', async (req, res) => {
    infox_db.sync({ force: true }).then((data) => {
        infox_db.query(`
        CREATE TRIGGER before_invoice_insert
        BEFORE INSERT ON invoices
        FOR EACH ROW BEGIN DECLARE nextNo INT;
        -- Find the current next invoice number for the _sid
        SELECT MAX(_no) INTO nextNo
        FROM invoices
        WHERE _sid = NEW._sid
        LIMIT 1;
        -- If the _sid doesn't exist in InvoiceSequence, create a new entry
        IF nextNo IS NULL THEN
        SET nextNo = 1;
        ELSE
        -- Update the next invoice number for the _sid
        SET nextNo = nextNo + 1;
        END IF;
        -- Set the generated invoice number for the new invoice
        SET NEW._no = LPAD(nextNo, 5, '0');
        END;
        `).then((data) => {
            infox_db.query(`CREATE TRIGGER before_receipt_insert
            BEFORE INSERT ON receipts
            FOR EACH ROW
            BEGIN
                DECLARE nextNo INT;
                -- Find the current next invoice number for the _sid
                SELECT MAX(_no) INTO nextNo
                FROM receipts
                WHERE _sid = NEW._sid
                LIMIT 1;
                -- If the _sid doesn't exist in InvoiceSequence, create a new entry
                IF nextNo IS NULL THEN
                SET nextNo = 1;
                ELSE
                -- Update the next invoice number for the _sid
                SET nextNo = nextNo + 1;
                END IF;
                -- Set the generated invoice number for the new invoice
                SET NEW._no = LPAD(nextNo, 5, '0');
                END;
            `).then((data) => {
                bcrypt.hash('password', 10, (error, hash) => {
                    if (error) {
                        res.status(500).send(`? ${error}`);
                    }
                    else {
                        User.create({
                            email: 'user@domain.tld',
                            passwd: hash,

                            u_name: 'User Name',
                            u_mob: '0000000000',
                            u_profile: {},

                        }).then((user) => {
                            ServiceArea.create({
                                name: 'Service Area 1',
                                code: 'SA1',
                                place: 'Place 1',

                                lat: '0.000000',
                                lng: '0.000000',

                                contact_no: '0000000000',
                                contact_name: 'Contact Name 1',

                                _owner_uid: user.u_id

                            }).then((service_area) => {

                                user.addServiceArea(service_area);
                                let customer = Array.from({ length: 4 }, (_, index) => ({
                                    name: faker.person.fullName(),
                                    address: faker.location.streetAddress(),
                                    contact_no: faker.number.int({ min: 7000000000, max: 9999999999 }),
                                    whatsapp_no: faker.number.int({ min: 7000000000, max: 9999999999 }),
                                    _sid: service_area.s_id
                                }));
                                Customer.bulkCreate(customer).then((customers) => {
                                    customers.map((customer, index) => {
                                        setTimeout(() => {
                                            console.log(new Date().getTime())
                                            let amount = faker.finance.amount();
                                            Invoice.create({
                                                _type: 'type',
                                                _desc: faker.lorem.sentence(),
                                                _no: 0,

                                                amount: amount,
                                                date: new Date(),


                                                _cid: customer.c_id,
                                                _sid: service_area.s_id,
                                                _uid: user.u_id

                                            }).then((invoice) => {
                                                Receipt.create({
                                                    _no: faker.finance.iban(),
                                                    _type: 'type',
                                                    _desc: faker.lorem.sentence(),

                                                    amount: amount,
                                                    date: new Date(),

                                                    _cid: customer.c_id,
                                                    _sid: service_area.s_id,
                                                    _uid: user.u_id,
                                                    _iid: invoice.i_id

                                                }).then((receipt) => {
                                                    DayBook.create({
                                                        referenceNumber: faker.finance.iban(),
                                                        date: new Date(),
                                                        description: faker.lorem.sentence(),

                                                        debitAmount: 0,
                                                        creditAmount: receipt.amount,

                                                        accountName: faker.finance.accountName(),

                                                        notes: faker.lorem.paragraph(),

                                                        _cid: customer.c_id,
                                                        _sid: service_area.s_id,
                                                        _uid: user.u_id,

                                                    }).then((daybook) => {

                                                        Invoice.update({ _rid: receipt.r_id }, { where: { i_id: invoice.i_id } }).then((data) => {
                                                            console.log(data);
                                                            Invoice.create({

                                                                _type: 'type',
                                                                _desc: faker.lorem.sentence(),
                                                                _no: 0,

                                                                amount: faker.finance.amount(),
                                                                date: new Date(),


                                                                _cid: customer.c_id,
                                                                _sid: service_area.s_id,
                                                                _uid: user.u_id

                                                            });
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        });

                                                    })
                                                })

                                            });
                                        }, 500 * index + 1);
                                    });
                                })
                            });
                        });

                    }
                });
            });
        });
        res.send('Synced');
    }, (err) => {
        res.send(`${err}`);
    });
});


app.use('/', express.static(path.join(__dirname, '/app_vite')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/app_vite/index.html'));
});
app.listen(3001), () => {
    console.log("API runing on Port 3001");
};