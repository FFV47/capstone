# * PRD Build
FROM python:3.10-slim as prd

SHELL [ "/bin/bash", "-c" ]

COPY base-deps.sh ./
RUN ./base-deps.sh

RUN mkdir -p /home/app

COPY requirements.txt /home/app
ENV PATH=".venv/bin:${PATH}" \
  PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /home/app
RUN python -m venv .venv \
  && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT [ "./app-setup.sh" ]
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

# * Dev Build
FROM prd as dev

SHELL [ "/bin/bash", "-c" ]

# Install Poetry and Node.js
COPY poetry-node.sh ./
RUN ./poetry-node.sh

ENV \
  DEBUG=false \
  # poetry
  POETRY_VIRTUALENVS_IN_PROJECT=true \
  POETRY_HOME=/opt/poetry

# update PATH
ENV PATH=".venv/bin:${POETRY_HOME}/bin:${PATH}"

RUN mkdir -p /home/app
WORKDIR /home/app
# Copy these first, otherwise poetry reinstall packages on rebuild
COPY poetry.lock pyproject.toml ./
# Install all dependencies
RUN poetry install -n --no-root && npm install

COPY . .

EXPOSE 8000

ENTRYPOINT [ "./app-setup.sh" ]
