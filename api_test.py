import requests

url = 'http://localhost:5000/api'
r = requests.post(url, json={'data': "International Conference on NLP Trends & Technologies (NLPTT 2020) December 12~13, 2020, Dubai,"
                                     " UAE https://cse2020.org/nlptt/index.html Call for Papers International Conference on NLP Trends & Technologies (NLPTT 2020) "
                                     "will provide an excellent international forum for sharing knowledge and results in theory, methodology and applications of "
                                     "Natural Language Computing technologies and its applications. Topics of interest include, but are not limited to, the following Paper"
                                     " Submission Authors are invited to submit papers through the conference Submission System by September 06, 2020. Submissions must be "
                                     "original and should not have been published previously or be under consideration for publication while being evaluated for this conference."
                                     " The proceedings of the conference will be published by Computer Science Conference Proceedings in Computer Science & Information Technology "
                                     "(CS & IT) series (Confirmed). Selected papers from NLPTT 2020, after further revisions, will be published in the special issue of the following"
                                     " journal. International Journal on Computational Science & Applications (IJCSA) International Journal on Information Theory (IJIT)"
                                     "International Journal on Natural Language Computing (IJNLC) International Journal of Web & Semantic Technology (IJWesT) "
                                     "Information Technology in Industry (ITII)New-ESCI(WOS) Indexed Important Dates Submission Deadline : September 06, 2020"
                                     "Authors Notification : October 30, 2020 Registration & camera - Ready Paper Due : November 08, 2020"})
print(r.json())