import { updateInvoiceTx } from '../server/modules';

export default async ({ invoice }, res) => res.json(await updateInvoiceTx(invoice.username, invoice));
