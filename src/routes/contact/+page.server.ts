import { fail } from '@sveltejs/kit';
import mail from '@sendgrid/mail';
// @ts-ignore
import { SENDGRID_API_KEY, EMAIL_SEND_TO } from '$env/static/private';

type Message = {
	naam: string;
	email: string;
	onderwerp: string;
	bericht: string;
};

export const actions = {
	default: async ({ request }) => {
		const data: Message = {
			naam: '',
			email: '',
			onderwerp: '',
			bericht: ''
		};

		if (!SENDGRID_API_KEY)
			return fail(500, {
				success: false,
				data,
				message: 'Er is geen api-key gedefinieerd voor het verzenden van e-mail.'
			});
		if (!EMAIL_SEND_TO)
			return fail(500, {
				success: false,
				data,
				message: 'Er is geen geaddresseerde gedefinieerd voor het verzenden van e-mail.'
			});
		const formData = await request.formData();

		const invalidFields: string[] = [];

		for (const key of Object.keys(data)) {
			if (!formData.has(key) || formData.get(key)?.toString().trim() === '') {
				invalidFields.push(`"${key}"`);
			}
			data[key as keyof typeof data] = formData.get(key) as string;
		}
		if (invalidFields.length > 0) {
			const count = invalidFields.length;
			const lastVeld = invalidFields.pop();
			return fail(400, {
				success: false,
				data,
				message: `${count == 1 ? 'Het veld' : 'De velden'} ${invalidFields.join(', ')}${
					invalidFields.length === 0 ? '' : ' en '
				} ${lastVeld} ${count == 1 ? 'is' : 'zijn'} niet juist ingevuld.`
			});
		} else {
			return sendMail(data)
				.then((_) => {
					return { success: true, data };
				})
				.catch((e) => {
					console.error(e);
					return fail(500, {
						success: false,
						data,
						message:
							'Uw bericht kan momenteel niet verzonden worden door een fout bij ons. Probeert u het eventueel later nogmaals.'
					});
				});
		}
	}
};

const sendMail = async (formData: Message) => {
	mail.setApiKey(SENDGRID_API_KEY);
	return mail.send({
		to: EMAIL_SEND_TO,
		from: {
			email: formData.email,
			name: formData.naam
		},
		subject: formData.onderwerp,
		text: formData.bericht
	});
};
