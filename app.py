from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# ✅ MySQL Connection Setup (Change password if needed)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1505",  # CHANGE THIS to your root password
    database="user_auth"
)
cursor = db.cursor()

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        try:
            name = request.form['name']
            email = request.form['email']
            phone = request.form['phone']
            username = request.form['username']
            password = request.form['password']

            # ✅ Check if username already exists
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()
            if existing_user:
                flash("Username already exists. Please choose another.", "error")
                return redirect(url_for('register'))

            # ✅ Insert new user
            cursor.execute(
                "INSERT INTO users (name, email, phone, username, password) VALUES (%s, %s, %s, %s, %s)",
                (name, email, phone, username, password)
            )
            db.commit()
            flash("Registration successful! Please log in.", "success")
            return redirect(url_for('login'))

        except mysql.connector.Error as err:
            print("MySQL Error:", err)
            flash("Database error. Please try again.", "error")
            return redirect(url_for('register'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
        user = cursor.fetchone()

        if user:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            flash("Invalid username or password", "error")
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/home')
def home():
    if 'username' in session:
        return render_template('home.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/explore path')
def stockmarket():
    return render_template('stockmarket.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
