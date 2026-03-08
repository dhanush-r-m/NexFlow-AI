import { Client } from '@hubspot/api-client'

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_API_KEY!,
})

export async function createContact(
  email: string,
  name: string,
  amount: number
) {
  try {
    const [firstname, ...lastParts] = name.split(' ')
    const lastname = lastParts.join(' ')

    const contact = await hubspotClient.crm.contacts.basicApi.create({
  properties: {
    email,
    firstname: firstname || 'Unknown',
    lastname: lastname || '',
    // Remove amount_paid for now
  },
})

    return { success: true, contactId: contact.id }
  } catch (error: any) {
    // Contact might already exist
    if (error.code === 409) {
      return { success: true, message: 'Contact already exists' }
    }
    throw error
  }
}

export async function getContacts() {
  const contacts = await hubspotClient.crm.contacts.basicApi.getPage(
    10,
    undefined,
    ['firstname', 'lastname', 'email', 'amount_paid']
  )

  return contacts.results.map(c => ({
    id: c.id,
    name: `${c.properties.firstname || ''} ${c.properties.lastname || ''}`.trim(),
    email: c.properties.email || '',
    amountPaid: c.properties.amount_paid || '0',
  }))
}