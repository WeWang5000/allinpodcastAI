import featureform as ff
from featureform import local

client = ff.Client(local=True)
'''
episodes = local.register_directory(
    name="mlops-episodes",
    path="/Users/Labducas/Desktop/tt/data",
    description="Transcripts from recent MLOps episodes",
)
'''
import os

directory_path = "/Users/Labducas/Desktop/tt/data1"
encoded_directory_path = "/Users/Labducas/Desktop/tt/data1_encoded"

# Create a new directory for the encoded files
os.makedirs(encoded_directory_path, exist_ok=True)

# Iterate over the files in the original directory
for filename in os.listdir(directory_path):
    file_path = os.path.join(directory_path, filename)
    encoded_file_path = os.path.join(encoded_directory_path, filename)

    # Read the file contents with GBK encoding, replacing errors
    with open(file_path, 'r', encoding='gbk', errors='replace') as file:
        file_contents = file.read()

    # Write the file contents with UTF-8 encoding
    with open(encoded_file_path, 'w', encoding='utf-8') as encoded_file:
        encoded_file.write(file_contents)

# Register the encoded directory
episodes = local.register_directory(
    name="mlops-episodes",
    path=encoded_directory_path,
    description="Transcripts from recent MLOps episodes",
)

#ff.set_run("run1")
@local.df_transformation(inputs=[episodes])
def process_episode_files(dir_df):
    from io import StringIO
    import pandas as pd

    episode_dfs = []
    for i, row in dir_df.iterrows():
        csv_str = StringIO(row[1])
        r_df = pd.read_csv(csv_str, sep=";")
        r_df["filename"] = row[0]
        episode_dfs.append(r_df)

    return pd.concat(episode_dfs)

@local.df_transformation(inputs=[process_episode_files])
def speaker_primary_key(episodes_df):
    episodes_df["PK"] = episodes_df.apply(lambda row: f"{row['Speaker']}_{row['Start time']}_{row['filename']}", axis=1)
    return episodes_df

@local.df_transformation(inputs=[speaker_primary_key])
def vectorize_comments(episodes_df):
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(episodes_df["Text"].tolist())
    episodes_df["Vector"] = embeddings.tolist()

    return episodes_df

pinecone = ff.register_pinecone(
    name="pinecone",
    project_id="default",
    environment="asia-southeast1-gcp-free",
    api_key="5019f526-152d-4ea7-a715-78983c900917",
)

@ff.entity
class Speaker:
    comment_embeddings = ff.Embedding(
        vectorize_comments[["PK", "Vector"]],
        dims=384,
        vector_db=pinecone,
        description="Embeddings created from speakers' comments in episodes",
        variant="v2"
    )
    comments = ff.Feature(
        speaker_primary_key[["PK", "Text"]],
        type=ff.String,
        description="Speakers' original comments",
        variant="v2"
    )

@ff.ondemand_feature(variant="calhacks")
def relevent_comments(client, params, entity):
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    search_vector = model.encode(params["query"])
    res = client.nearest("comment_embeddings", "v2", search_vector, k=3)
    return res

@ff.ondemand_feature(variant="calhack")
def contextualized_prompt(client, params, entity):
    pks = client.features([("relevent_comments", "calhacks")], {}, params=params)
    prompt = "Use the following snippets from our podcast to answer the following question\n"
    for pk in pks[0]:
        prompt += "```"
        prompt += client.features([("comments", "v2")], {"speaker": pk})[0]
        prompt += "```\n"
    prompt += "Question: "
    prompt += params["query"]
    prompt += "?"
    return prompt

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/endpoint', methods=['POST'])
def handle_user_input():
    user_input = request.json.get('userInput')

    # Process the user input in your Python code
    q = user_input
    client.apply()
    prompt = client.features([("contextualized_prompt", "calhack")], {}, params={"query": q})[0]
    import openai
    openai.organization = "org-ZsjXx3AgIXIWjxr7TGkViTsi"
    openai.api_key = "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"
    answers = (openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=1000, # The max number of tokens to generate
        temperature=1.0 # A measure of randomness
    )["choices"][0]["text"])

    response = {'message': 'Received user input: {}'.format(answers)}

    return jsonify(response)

if __name__ == '__main__':
    app.run()
'''

q = "How important is it to be premium?"
client.apply()
prompt = client.features([("contextualized_prompt", "calhack")], {}, params={"query": q})[0]

import openai
openai.organization = "org-ZsjXx3AgIXIWjxr7TGkViTsi"
openai.api_key = "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"
print(openai.Completion.create(
    model="text-davinci-003",
    prompt=prompt,
    max_tokens=1000, # The max number of tokens to generate
    temperature=1.0 # A measure of randomness
)["choices"][0]["text"])
'''
