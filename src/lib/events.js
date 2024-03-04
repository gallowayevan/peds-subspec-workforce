import { goto } from '$app/navigation';
import options from '$lib/settings/options.js';
import { cross } from 'd3-array';

/*
Events for responding to user interactions and navigating to the appropriate visualization.
Note the use of URLSearchParams copies to avoid mutating the version in the $page store, which
is supposed to be read-only.
*/

export function handleShowProjection({ detail }, { url: { searchParams, pathname } }) {
	/*
    This is a workaround to handle the situation in which the user selects all subspectialties, all regions or all divisions (separate), 
    which requires the addition of more than one projection request.
    */
	let projectionsArray = [detail];

	const detailsWithAllOptions = detail.filter((d) => d.value < 0);

	if (detailsWithAllOptions.length > 0) {
		const detailsWithoutAllOptions = detail.filter((d) => d.value >= 0);

		//First get an array of groups of generated option codes and labels
		const newProjections = detailsWithAllOptions.map(function (d) {
			const currentOptions = options.get(d.name);

			const currentOptionCodes = currentOptions.options
				?.filter(function (e) {
					if ((+d.value === -1) & (currentOptions.name === 'location')) {
						return (e.value >= 200) & (e.value < 300);
					} else if ((+d.value == -2) & (currentOptions.name === 'location')) {
						return (e.value >= 400) & (e.value < 500);
					} else {
						return e.value > 0;
					}
				})
				.map((e) => e.value);
			return currentOptionCodes.map(function (code) {
				const currentEntry = { name: currentOptions.name, value: code };
				// return [...detailsWithoutAllOptions, currentEntry];
				return currentEntry;
			});
		});

		/*Cross the generated projection codes to get all possible combinations
and then add on the paramaters that are the same for all projections.
*/
		projectionsArray = cross(...newProjections).map((d) => [...d, ...detailsWithoutAllOptions]);
	}

	const projString =
		`&proj=` +
		projectionsArray.map((d) => d.map((d) => `${d.name}-${d.value}`).join(`_`)).join(`&proj=`);

	//Should we replace or append to the existing query string.
	const replaceNotAppend = pathname === '/map';
	const searchParamsCopy = new URLSearchParams(searchParams.toString());
	searchParamsCopy.delete('clear');

	goto(`${pathname}?${replaceNotAppend ? `` : searchParamsCopy.toString()}${projString}`, {
		noscroll: true
	});
}

export function handleDeleteProjection({ detail }, { url: { searchParams, pathname } }) {
	/*If this is the last projection we are deleting then make it a 'clear' to avoid
    the redirect
    */
	const searchParamsCopy = new URLSearchParams(searchParams.toString());

	if (searchParamsCopy.getAll('proj').length === 1) {
		searchParamsCopy.set('clear', 1);
	}
	const newSearchParams = new URLSearchParams(
		searchParamsCopy.toString().replace(`proj=${detail}`, '')
	);
	goto(`${pathname}?${newSearchParams.toString()}`, { noscroll: true });
}

export function handleExceptLocation({ detail }, { url: { searchParams, pathname } }) {
	searchParams.has('except');

	goto(`${pathname}?${searchParams.toString()}&except=${detail}`, { noscroll: true });
}

export function handleClearData({ url: { searchParams, pathname } }) {
	const searchParamsCopy = new URLSearchParams(searchParams.toString());

	searchParamsCopy.delete('proj');
	searchParamsCopy.set('clear', 1);
	goto(`${pathname}?${searchParamsCopy.toString()}`);
}
