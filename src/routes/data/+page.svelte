<h1>Data</h1>
<div class="row">
	<div class="col col-sm-12 col-md-12 col-lg-9">
		<p class="lead">
			Deze pagina is in het Engels om zoveel mogelijk mensen de kans te geven om de data te
			gebruiken.
		</p>
		<h2>Iv3-data</h2>
		<p>
			Up till 2015 we have been collecting the data for openspending.nl ourselves. Nowadays,
			Statistics Netherlands (Centraal Bureau voor de Statistiek/CBS) releases most of the data and
			thus has become our main source. Every government body (municipality, province, ‘waterschap’
			and ‘gemeenschappelijke regeling’) reports their financial information to the CBS in a
			standardized format called ‘<a
				href="https://www.rijksoverheid.nl/onderwerpen/financien-gemeenten-en-provincies/inhoud/uitwisseling-financiele-gegevens-met-sisa-en-iv3/informatie-voor-derden-iv3"
				target="_blank"
				rel="noopener noreferrer">Informatie voor Derden</a
			>‘ or ‘Iv3’. More information can be found
			<a
				href="https://www.cbs.nl/nl-nl/deelnemers-enquetes/deelnemers-enquetes/decentrale-overheden/overzicht/kredo"
				target="_blank"
				rel="noopener noreferrer">on the website of Bureau KREDO</a
			>
			(the department within CBS which deals with the Iv3 data). This page gives more details on
			their release of
			<a
				href="https://www.cbs.nl/nl-nl/onze-diensten/open-data/iv3"
				target="_blank"
				rel="noopener noreferrer">open data</a
			>
			and here is a
			<a
				href="https://dataderden.cbs.nl/ODatacatalog/Tables?$format=json"
				target="_blank"
				rel="noopener noreferrer">direct link to their API</a
			>. You can also use our API, see the section below, which has an easier way of accessing the
			data and also contains metrics for the governments.
		</p>
    <!--
		<h2>Detaildata</h2>
		<p>
			We’re also publishing financial data on a more detailed level in cooperation with several
			government bodies, so-called ‘detaildata’. See this example for the <a
				href="https://openspending.nl/groningen-gemeente/begroting/2016/lasten/hoofdfuncties/#tab-details"
				>detaildata of the municipality Groningen</a
			>
			(click on the ‘Detail Data’ tab). Read the posts regarding the detaildata of both the
			<a
				href="https://blog.openspending.nl/2016/01/15/groningen-pionier-bij-het-vrijgeven-van-financien-op-detailniveau/"
				target="_blank"
				rel="noopener">province Groningen and the municipality Groningen</a
			>
			(Dutch) or this post on the detaildata of the
			<a
				href="https://openstate.eu/en/2016/03/five-dutch-municipalities-release-detailed-openspending-data/"
				target="_blank"
				rel="noopener">municipalities of Dordrecht, Heerlen, Lelystad, Oirschot and Utrecht</a
			>. This detaildata can be found here in a
			<a
				href="https://blog.openspending.nl/wp-content/uploads/sites/5/2016/03/Detaildata-gemeenten-24-maart-2017.zip"
				rel="noopener noreferrer">ZIP file</a
			>. You can also access this data through our API, see the section below.
		</p>
    -->
		<h3>API</h3>
		<p>
			We have made the openspending.nl Iv3-data and detaildata available via an API. The easiest way
			to get to know the data is to start exploring it via our interactive Swagger/OpenAPI
			documentation:
		</p>
		<p></p>
		<center
			><button class="btn btn-primary"
				><strong
					><a class="text-white" href="https://data.openspending.nl" target="_blank" rel="noopener noreferrer"
						>Open Spending API Swagger/OpenAPI Documentation</a
					></strong
				></button
			></center
		>
		<p></p>
		<h2>Terms &amp; Explanation</h2>
		<p>
			Here is some basic information about this data and the terms we use. First of all, each local
			government body delivers its budgets/realisation data to the CBS using an Excel form. Check
			out the empty example forms for <a
				href="https://www.cbs.nl/-/media/imported/documents/2015/32/2015-08-06-model-iv3-b-gem-2016.xls"
				>municipalities</a
			>
			and
			<a
				href="https://www.cbs.nl/-/media/imported/documents/2016/09/2016-03-02-model-iv3-j-prov-2015.xls"
				>provinces</a
			>
			(go to the
			<a
				href="https://www.cbs.nl/nl-nl/deelnemers-enquetes/deelnemers-enquetes/decentrale-overheden/overzicht/kredo"
				target="_blank"
				rel="noopener noreferrer">website of Bureau KREDO for more examples</a
			>). Even better, check out
			<a
				href="https://blog.openspending.nl/wp-content/uploads/sites/5/2014/02/krd115060098.xls"
				rel="">this form containing the actual data of the municipality Weststellingwerf</a
			>. The values which we are interested in are shown in the sheets called “5.Verdelingsmatrix
			lasten” for the expenses and “6.Verdelingsmatrix baten” for the income values. The
			<strong>main takeaway</strong> is that these values are structured as a matrix as shown in this
			image:
		</p>
		<p>
			<img
				decoding="async"
				class="img-responsive alignnone size-full wp-image-779"
				src="https://blog.openspending.nl/wp-content/uploads/sites/5/2014/02/Screenshot-from-2016-04-11-190638.png"
				alt="Screenshot from 2016-04-11 19:06:38"
				width="100%"
				srcset="https://blog.openspending.nl/wp-content/uploads/sites/5/2014/02/Screenshot-from-2016-04-11-190638.png 1079w, https://blog.openspending.nl/wp-content/uploads/sites/5/2014/02/Screenshot-from-2016-04-11-190638-300x195.png 300w, https://blog.openspending.nl/wp-content/uploads/sites/5/2014/02/Screenshot-from-2016-04-11-190638-1024x667.png 1024w"
				sizes="(max-width: 1079px) 100vw, 1079px"
			/>
		</p>
		<p>
			On the vertical axis (on the left) you see the functions to which a value can belong, e.g.
			“210 Wegen, straten en pleinen” (roads, streets and squares). We call these “<strong
				>subfunctions</strong
			>” or “<strong>sub</strong>” as we also allow you to extract the data on the “<strong
				>main function</strong
			>” or “<strong>main</strong>” level, e.g., “Hoofdfunctie 2 VERKEER, VERVOER EN WATERSTAAT”
			(Main function 2 TRAFFIC, TRANSPORT AND WATER). Such a value is not simply 1 number, but
			broken down into the “<strong>categories</strong>” or “<strong>cat</strong>” you see on the
			horizontal axis (on the top). In the case of “210 Wegen, straten en pleinen” its expenses were
			spent as follows: 164 was spent on “Energie” (energy), 44 on “Betaalde belastingen” (paid
			taxes), etc. Note that all these values are divided by 1,000 (one thousand). So the actual
			spending on energy was €164,000. In our API, we call these values “<strong>entries</strong>“.
			Only cells with an actual value are stored in our API.
		</p>
		<p>
			Another term used in the API is “<strong>document</strong>“. This relates to the Excel forms
			shown above. Each Excel form is one document and thus contains the values for one government
			body for a certain year and period. The local government bodies send the CBS up to 6 of those
			documents per year, called <strong>periods</strong> 0 till 5. A document with period 0 contains
			the budget for the whole year ((jaar)begroting), periods 1-4 contain the actual spending (realisatie)
			for each quarter of the year and period 5 contains the spending of the whole year ((jaar)realisatie).
			Some governments also submit quarterly budgets to the CBS. This are adjusted budgets as in ‘budget
			per quarter’.
		</p>
		<h2>Example</h2>
		<p>
			Our <a href="/lijstenmaker"
				>Open Spending Lijstjes</a
			>
			tool makes uses of our own Open Spending API (eat your own dog food ;D). Its code is posted
			on GitHub. 
	</div>
</div>
