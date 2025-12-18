function handleFormSubmit(event) {
  event.preventDefault();
  
  // Очищаем предыдущие ошибки
  clearErrors();
  
  const formData = serializeForm(event.target);
  
  // Проверяем все валидации
  const errors = validateAllFields(formData);
  
  if (errors.length > 0) {
    // Показываем ошибки в интерфейсе
    showErrors(errors);
    return;
  }
  
  // Если ошибок нет, показываем успех и логируем
  showSuccess('Форма успешно отправлена!');
  validateFormWithRegex(formData); 
}

function showErrors(errors) {
  const errorContainer = document.getElementById('errorMessages');
  errorContainer.innerHTML = '';
  
  errors.forEach(error => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = error.message;
    errorContainer.appendChild(errorElement);
    if (error.field) {
      const field = document.querySelector(`[name="${error.field}"]`);
      if (field) {
        field.classList.add('field-error');
      }
    }
  });
}

function showSuccess(message) {
  const errorContainer = document.getElementById('errorMessages');
  errorContainer.innerHTML = '';
  
  const successElement = document.createElement('div');
  successElement.className = 'error-message';
  successElement.style.backgroundColor = '#e8f5e9';
  successElement.style.color = '#2e7d32';
  successElement.style.borderLeftColor = '#2e7d32';
  successElement.textContent = message;
  errorContainer.appendChild(successElement);
}

function clearErrors() {
  const errorContainer = document.getElementById('errorMessages');
  errorContainer.innerHTML = '';
  
  // Убираем подсветку полей
  document.querySelectorAll('.field-error').forEach(field => {
    field.classList.remove('field-error');
  });
}

function validateAllFields(formData) {
  const errors = [];
  
  // Валидация ФИО
  const fioRegex = /^(\S+)\s+(\S+)\s+(\S+)$/;
  if (!fioRegex.test(formData.fio)) {
    errors.push({
      field: 'fio',
      message: 'ФИО должно быть в формате "Фамилия Имя Отчество"'
    });
  }
  
  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Неверный формат email адреса'
    });
  }
  
  // Проверка совпадения паролей
  if (formData.password !== formData.repeatPassword) {
    errors.push({
      field: 'repeatPassword',
      message: 'Пароли не совпадают'
    });
  }
  
  // Проверка сложности пароля
  const passwordErrors = validatePasswordStrength(formData.password);
  errors.push(...passwordErrors);
  
  // Валидация адреса
  const addressErrors = validateAddressFields(formData.adres);
  errors.push(...addressErrors);
  
  return errors;
}

function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Пароль должен содержать минимум 8 символов'
    });
  }
    
  return errors;
}

function validateAddressFields(address) {
  const errors = [];
  
  if (!address) {
    errors.push({
      field: 'adres',
      message: 'Адрес обязателен для заполнения'
    });
    return errors;
  }
  
  // Проверка формата города
  if (!/^г\.\s*Минск/i.test(address)) {
    errors.push({
      field: 'adres',
      message: 'Адрес должен начинаться с "г. Минск"'
    });
  }
  
  const streetMatch = address.match(/(ул\.|улица)\s+([^,]+)/i);
  if (!streetMatch) {
    errors.push({
      field: 'adres',
      message: 'В адресе не указана улица (используйте "ул." или "улица")'
    });
  }
  
  const homeMatch = address.match(/(д\.|дом)\s+([^,]+)/i);
  if (!homeMatch) {
    errors.push({
      field: 'adres',
      message: 'В адресе не указан дом (используйте "д." или "дом")'
    });
  }
  
  return errors;
}

function serializeForm(formNode) {
  const formData = {};
  const { elements } = formNode;

  Array.from(elements)
    .filter((element) => element.name)
    .forEach((element) => {
      const { name, value, type, checked } = element;
      
      if (type === 'checkbox') {
        formData[name] = checked;
      } else {
        formData[name] = value;
      }
    });
  
  return formData;
}

function validateFormWithRegex(formData) {
  console.log('\n=== ПРИМЕНЕНИЕ REGEXP И STRING МЕТОДОВ ===\n');
  
  console.log('1. RegExp.test() - проверка email:');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  console.log(`Email "${formData.email}" валиден:`, isEmailValid);
  
  console.log('\n2. RegExp.exec() - парсинг ФИО:');
  const fioRegex = /^(\S+)\s+(\S+)\s+(\S+)$/;
  const fioMatch = fioRegex.exec(formData.fio);
  if (fioMatch) {
    console.log('Фамилия:', fioMatch[1]);
    console.log('Имя:', fioMatch[2]);
    console.log('Отчество:', fioMatch[3]);
  } else {
    console.log('ФИО не соответствует формату "Фамилия Имя Отчество"');
  }
  
  console.log('\n3. String.split() - разделение адреса:');
  const addressParts = formData.adres.split(',');
  console.log('Части адреса:', addressParts);
  console.log('Город:', addressParts[0]?.trim() || 'не указан');
  console.log('Улица:', addressParts[1]?.trim() || 'не указана');
  console.log('Дом:', addressParts[2]?.trim() || 'не указан');
  
  console.log('\n4. String.match() - поиск цифр в пароле:');
  const digitsInPassword = formData.password.match(/\d/g);
  console.log('Цифры в пароле:', digitsInPassword);
  console.log('Количество цифр:', digitsInPassword ? digitsInPassword.length : 0);
  
  console.log('\n5. String.search() - поиск города в адресе:');
  const cityPosition = formData.adres.search(/г\.\s*Минск/i);
  console.log(`Позиция "г.Минск" в адресе:`, cityPosition);
  console.log('Адрес начинается с города:', cityPosition === 0);
  
  console.log('\n6. String.replace() - маскировка email:');
  const maskedEmail = formData.email.replace(/(?<=.).(?=.*@)/g, '*');
  console.log('Исходный email:', formData.email);
  console.log('Замаскированный email:', maskedEmail);
  
  console.log('\n7. Комплексная проверка пароля:');
  const passwordStrength = checkPasswordStrength(formData.password);
  console.log('Надежность пароля:', passwordStrength);
  
  console.log('\n8. Комплексная валидация адреса:');
  validateAddress(formData.adres);
}

function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const passed = Object.values(checks).filter(Boolean).length;
  
  const upperCase = password.match(/[A-Z]/g) || [];
  const lowerCase = password.match(/[a-z]/g) || [];
  const numbers = password.match(/\d/g) || [];
  const special = password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [];
  
  console.log('  - Длина >= 8:', checks.length);
  console.log('  - Заглавные буквы:', upperCase.length, 'шт:', upperCase);
  console.log('  - Строчные буквы:', lowerCase.length, 'шт:', lowerCase);
  console.log('  - Цифры:', numbers.length, 'шт:', numbers);
  console.log('  - Спецсимволы:', special.length, 'шт:', special);
  
  return `${passed}/5 критериев выполнено`;
}

function validateAddress(address) {
  console.log('Исходный адрес:', address);
  
  const hasCity = /^г\.\s*Минск/i.test(address);
  console.log('  - Содержит город Минск:', hasCity);
  
  const streetPos = address.search(/ул\.|улица/i);
  console.log('  - Позиция улицы:', streetPos);
  
  const streetMatch = address.match(/(ул\.|улица)\s+([^,]+)/i);
  console.log('  - Улица:', streetMatch ? streetMatch[2] : 'не найдена');
  
  const homePos = address.search(/д\.|дом/i);
  console.log('  - Позиция дома:', homePos);
  
  const homeMatch = address.match(/(д\.|дом)\s+([^,]+)/i);
  console.log('  - Дом:', homeMatch ? homeMatch[2] : 'не найден');

  const normalized = address
    .replace(/\s+/g, ' ') 
    .replace(/ул\./gi, 'улица')
    .replace(/г\.\s*Минск/gi, 'г. Минск'); 
  
  console.log('  - Нормализованный адрес:', normalized);
  
  const addressRegex = /г\.\s*Минск,\s*(ул\.|улица)\s+([^,]+),\s*(д\.|дом)\s+([^,]+)/i;
  const detailed = addressRegex.exec(address);
  if (detailed) {
    console.log('  - Детальный парсинг:');
    console.log('    Город:', 'Минск');
    console.log('    Улица:', detailed[2]);
    console.log('    Дом:', detailed[4]); 
  }
}

const applicantForm = document.getElementById('registration');
applicantForm.addEventListener('submit', handleFormSubmit);