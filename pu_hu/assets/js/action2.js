
        // 가입자와 동일 체크박스 핸들러
        document.getElementById('sameAsSubscriber').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('accountHolder').value = document.getElementById('customerName').value;
                document.getElementById('accountHolderBirth').value = document.getElementById('birthDate').value;
                document.getElementById('accountHolderRelation').value = '본인';
            } else {
                document.getElementById('accountHolder').value = '';
                document.getElementById('accountHolderBirth').value = '';
                document.getElementById('accountHolderRelation').value = '';
            }
        });

        // 기타 체크박스 핸들러
        document.getElementById('otherService').addEventListener('change', function() {
            document.getElementById('otherServiceName').disabled = !this.checked;
            if (!this.checked) {
                document.getElementById('otherServiceName').value = '';
            }
        });

        // 요금 납부 방법에 따른 필드 변경
        document.getElementById('paymentMethod').addEventListener('change', function() {
            const accountNumber = document.getElementById('accountNumber');
            const bankName = document.getElementById('bankName');
            const accountHolder = document.getElementById('accountHolder');
            const accountHolderBirth = document.getElementById('accountHolderBirth');
            const accountHolderRelation = document.getElementById('accountHolderRelation');

            if (this.value === 'account') {
                accountNumber.placeholder = '납부할 계좌번호';
                bankName.closest('.field-group').style.display = 'block';
            } else if (this.value === 'card') {
                accountNumber.placeholder = '납부할 카드번호';
                bankName.closest('.field-group').style.display = 'none';
            } else if (this.value === 'giro') {
                accountNumber.placeholder = '지로번호';
                bankName.closest('.field-group').style.display = 'none';
            }
        });

        // 고객구분에 따른 필드 변경
        document.getElementById('customerType').addEventListener('change', function() {
            const birthDateField = document.getElementById('birthDate');
            const customerNameField = document.getElementById('customerName');

            if (this.value === 'korean') {
                birthDateField.placeholder = '법정생년월일';
                customerNameField.placeholder = '고객명(법인명)';
            } else if (this.value === 'foreigner') {
                birthDateField.placeholder = '외국인등록번호';
                customerNameField.placeholder = '고객명(영문)';
            } else if (this.value === 'corporate') {
                birthDateField.placeholder = '사업자등록번호';
                customerNameField.placeholder = '법인명';
            }
        });

        // 업무구분에 따른 필드 표시/숨김
        document.getElementById('businessType').addEventListener('change', function() {
            // 업무 유형에 따라 필요한 필드를 표시하거나 숨김
            const simSection = document.getElementById('usimNumber').closest('.field-group');
            const deviceSection = document.getElementById('deviceModel').closest('.field-group');

            if (this.value === 'numberTransfer') {
                // 번호이동: 모든 필드 표시
                simSection.style.display = 'block';
                deviceSection.style.display = 'block';
            } else if (this.value === 'newSubscription') {
                // 신규가입: 모든 필드 표시
                simSection.style.display = 'block';
                deviceSection.style.display = 'block';
            } else if (this.value === 'deviceChange') {
                // 기기변경: 단말기 정보 필수
                simSection.style.display = 'block';
                deviceSection.style.display = 'block';
            }
        });

        // eSIM 체크박스 핸들러
        document.getElementById('isEsim').addEventListener('change', function() {
            const usimField = document.getElementById('usimNumber');
            if (this.checked) {
                usimField.placeholder = 'eSIM EID 번호';
            } else {
                usimField.placeholder = 'USIM번호 8자리';
            }
        });

        // 주소 검색 함수 (실제 구현 시 다음 우편번호 API 등 사용)
        function searchAddress() {
            alert('주소 검색 기능은 별도 API 연동이 필요합니다.');
        }
