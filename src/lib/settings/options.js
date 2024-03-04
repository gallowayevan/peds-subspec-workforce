// import states from './states.js';

export default new Map(
	[
		{
			options: [
				{ value: 0, label: 'All Pediatric Subspecialties (Combined)' },
				{ value: 1, label: 'Adolescent Medicine' },
				{ value: 2, label: 'Pediatric Cardiology' },
				{ value: 3, label: 'Child Abuse Pediatrics' },
				{ value: 4, label: 'Pediatric Critical Care Medicine' },
				{ value: 5, label: 'Developmental-Behavioral Pediatrics' },
				{ value: 6, label: 'Pediatric Emergency Medicine' },
				{ value: 7, label: 'Pediatric Endocrinology' },
				{ value: 8, label: 'Pediatric Gastroenterology' },
				{ value: 9, label: 'Pediatric Hematology-Oncology' },
				{ value: 10, label: 'Pediatric Infectious Diseases' },
				{ value: 11, label: 'Neonatal-Perinatal Medicine' },
				{ value: 12, label: 'Pediatric Nephrology' },
				{ value: 13, label: 'Pediatric Pulmonology' },
				{ value: 14, label: 'Pediatric Rheumatology' }
			],
			label: 'Subspecialty',
			name: 'sscode'
		},
		{
			options: [
				{ value: 0, label: 'United States' },
				{ value: 200, label: 'Northeast (Census Region)' },
				{ value: 201, label: 'Midwest (Census Region)' },
				{ value: 202, label: 'South (Census Region)' },
				{ value: 203, label: 'West (Census Region)' },
				{ value: 400, label: 'East North Central (Census Division)' },
				{ value: 401, label: 'East South Central (Census Division)' },
				{ value: 402, label: 'Middle Atlantic (Census Division)' },
				{ value: 403, label: 'Mountain (Census Division)' },
				{ value: 404, label: 'New England (Census Division)' },
				{ value: 405, label: 'Pacific (Census Division)' },
				{ value: 406, label: 'South Atlantic (Census Division)' },
				{ value: 407, label: 'West North Central (Census Division)' },
				{ value: 408, label: 'West South Central (Census Division)' }
			],
			label: 'Region/Division',
			name: 'location'
		},
		{
			options: [
				{ value: 1, label: 'Headcount' },
				{ value: 0, label: 'CWE' }
			],
			label: 'Headcount or Clinical Workforce Equivalent (CWE)',
			name: 'headcount'
		},
		{
			options: [
				// { value: 70, label: 'Baseline with No General Diffusion' },
				// { value: 71, label: 'Baseline with General Diffusion' },
				{ value: 72, label: 'Baseline'},// with General Diffusion Including Non-U.S. Supply' },
				{ value: 74, label: 'Temporary 2% Fellow Decrease' },
				{ value: 75, label: 'Permanent 5% Fellow Increase' },
				{ value: 86, label: 'Decrease in Fellows by 12.5% by 2030'},
				{ value: 87, label: 'Increase in Fellows by 12.5% by 2030' },
				{ value: 76, label: '7% CWE Decrease' },
				{ value: 77, label: '7% CWE Increase' },
				{ value: 73, label: 'Increased Level of Exit at All Ages' },
				{ value: 78, label: 'Increased Level of Exit in Mid-Career' },
				{ value: 90, label: 'Fellow and CWE Decrease and Early Exit' },
				{ value: 91, label: 'Fellow and CWE Increase' }
			],
			label: 'Scenario',
			name: 'scenario'
		},
		{
			options: [
				{ value: 0, label: 'Total' },
				{ value: 1, label: 'Subspecialists per 100,000 Children' }
			],
			label: 'Total or Subspecialists per 100,000 Children',
			name: 'pop'
		},
		{
			options: [
				{ value: 902, label: 'Census Division' },
				{ value: 900, label: 'Census Region' }
			],
			label: 'Geography',
			name: 'geography'
		}
	].map((d) => [
		d.name,
		Object.assign({ optionsMap: new Map(d.options.map((e) => [e.value, e.label])) }, d)
	])
);
